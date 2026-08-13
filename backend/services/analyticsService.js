import mongoose from 'mongoose';
import Attendance from '../model/Attendance.js';
import Visitor from '../model/Visitor.js';
import { getCanonicalPhoneKey } from '../utils/normalizePhone.js';
import { getKolkataDayBounds, getKolkataPeriodBounds, formatKolkataDate } from '../utils/analyticsDateUtils.js';

/**
 * Builds a Map of canonical phone key to earliest check-in details.
 * Useful for checking if a visitor is new or returning.
 * 
 * @param {Array<string>} activeVisitorIds 
 * @returns {Promise<Map<string, { timestamp: Date, purpose: string, college: string, iAm: string, location: string }>>}
 */
export async function buildFirstVisitsMap(activeVisitorIds) {
  if (!activeVisitorIds || activeVisitorIds.length === 0) {
    return new Map();
  }

  // Find all check-ins for the active visitors, sort them, and group them by visitor
  const firstVisits = await Attendance.aggregate([
    { $match: { visitor: { $in: activeVisitorIds.map(id => new mongoose.Types.ObjectId(id)) } } },
    { $sort: { timestamp: 1 } },
    {
      $group: {
        _id: '$visitor',
        firstVisit: { $first: '$timestamp' },
        firstPurpose: { $first: '$purposeOfVisit' },
        firstLocation: { $first: '$location' }
      }
    },
    {
      $lookup: {
        from: 'visitors',
        localField: '_id',
        foreignField: '_id',
        as: 'visitorDetails'
      }
    },
    { $unwind: '$visitorDetails' },
    {
      $project: {
        visitorId: '$_id',
        phoneNumber: '$visitorDetails.phoneNumber',
        collegeName: '$visitorDetails.collegeName',
        iAm: '$visitorDetails.iAm',
        firstVisit: 1,
        firstPurpose: 1,
        firstLocation: 1
      }
    }
  ]);

  const canonicalMap = new Map();

  firstVisits.forEach(fv => {
    const key = getCanonicalPhoneKey(fv.phoneNumber);

    if (!canonicalMap.has(key)) {
      canonicalMap.set(key, {
        timestamp: fv.firstVisit,
        purpose: fv.firstPurpose,
        college: fv.collegeName,
        iAm: fv.iAm || 'Other',
        location: fv.firstLocation
      });
    } else {
      // Keep the overall earliest visit across all visitor documents representing this phone key
      const existing = canonicalMap.get(key);
      if (new Date(fv.firstVisit) < new Date(existing.timestamp)) {
        canonicalMap.set(key, {
          timestamp: fv.firstVisit,
          purpose: fv.firstPurpose,
          college: fv.collegeName,
          iAm: fv.iAm || 'Other',
          location: fv.firstLocation
        });
      }
    }
  });

  return canonicalMap;
}

/**
 * Helper to calculate metrics for a specific sub-period and location.
 * 
 * @param {Array<object>} attendances - populated attendance records
 * @param {Date} start 
 * @param {Date} end 
 * @param {string} [location] 
 * @param {Map} firstVisitsMap 
 * @returns {object}
 */
export function getStatsForPeriod(attendances, start, end, location, firstVisitsMap) {
  const filtered = attendances.filter(a => {
    const timeMatch = a.timestamp >= start && a.timestamp <= end;
    const locMatch = !location || a.location === location;
    return timeMatch && locMatch;
  });

  const periodPhones = new Set();
  filtered.forEach(a => {
    const key = getCanonicalPhoneKey(a.visitor.phoneNumber);
    periodPhones.add(key);
  });

  const totalVisits = filtered.length;
  const visitors = periodPhones.size;

  let newUsers = 0;
  let returningUsers = 0;

  periodPhones.forEach(key => {
    const fv = firstVisitsMap.get(key);
    if (fv) {
      if (fv.timestamp >= start && fv.timestamp <= end) {
        newUsers++;
      } else {
        returningUsers++;
      }
    }
  });

  return {
    newUsers,
    totalVisits,
    visitors,
    newVisitors: newUsers, // alias for "new today" / "new in period"
    returningUsers,
    returningVisitors: returningUsers // alias for "returning today" / "returning in period"
  };
}

/**
 * Generates deterministic insights from the dashboard data.
 * 
 * @param {Array<object>} newUsers 
 * @param {object} activeStats 
 * @param {object} prevStats 
 * @returns {Array<string>}
 */
function generateInsights(newUsers, activeStats, prevStats) {
  const insights = [];

  if (!newUsers || newUsers.length === 0) {
    insights.push('No new visitors registered during this period to compute demographics.');
    return insights;
  }

  // 1. Most common purpose
  const purposeCounts = {};
  newUsers.forEach(u => {
    const p = u.purpose || 'Other';
    purposeCounts[p] = (purposeCounts[p] || 0) + 1;
  });
  let topPurpose = null;
  let maxPurposeCount = 0;
  Object.keys(purposeCounts).forEach(p => {
    if (purposeCounts[p] > maxPurposeCount) {
      maxPurposeCount = purposeCounts[p];
      topPurpose = p;
    }
  });
  if (topPurpose) {
    const pct = Math.round((maxPurposeCount / newUsers.length) * 100);
    insights.push(`The most common purpose of visit is "${topPurpose}", accounting for ${pct}% of new users.`);
  }

  // 2. Top college
  const collegeCounts = {};
  newUsers.forEach(u => {
    const c = u.college || 'Other';
    collegeCounts[c] = (collegeCounts[c] || 0) + 1;
  });
  let topCollege = null;
  let maxCollegeCount = 0;
  Object.keys(collegeCounts).forEach(c => {
    if (collegeCounts[c] > maxCollegeCount) {
      maxCollegeCount = collegeCounts[c];
      topCollege = c;
    }
  });
  if (topCollege) {
    const pct = Math.round((maxCollegeCount / newUsers.length) * 100);
    insights.push(`Top college represented is "${topCollege}" with ${pct}% of new registrations.`);
  }

  // 3. Largest "I Am" category
  const iamCounts = {};
  newUsers.forEach(u => {
    const i = u.iAm || 'Other';
    iamCounts[i] = (iamCounts[i] || 0) + 1;
  });
  let topIam = null;
  let maxIamCount = 0;
  Object.keys(iamCounts).forEach(i => {
    if (iamCounts[i] > maxIamCount) {
      maxIamCount = iamCounts[i];
      topIam = i;
    }
  });
  if (topIam) {
    const pct = Math.round((maxIamCount / newUsers.length) * 100);
    insights.push(`The largest visitor category is "${topIam}", making up ${pct}% of new registrations.`);
  }

  // 4. Period-over-period change
  if (prevStats) {
    const prevNew = prevStats.newUsers;
    const currentNew = activeStats.newUsers;
    if (prevNew > 0) {
      const diffPct = Math.round(((currentNew - prevNew) / prevNew) * 100);
      if (diffPct > 0) {
        insights.push(`New registrations increased by ${diffPct}% compared to the previous period (${currentNew} vs ${prevNew}).`);
      } else if (diffPct < 0) {
        insights.push(`New registrations decreased by ${Math.abs(diffPct)}% compared to the previous period (${currentNew} vs ${prevNew}).`);
      } else {
        insights.push(`New registrations remained steady compared to the previous period (${currentNew} vs ${prevNew}).`);
      }
    } else if (currentNew > 0) {
      insights.push(`First-time registrations started this period with ${currentNew} new users, up from 0 in the previous period.`);
    }
  }

  return insights;
}

/**
 * Gets all dashboard analytics data.
 * 
 * @param {string|Date} [from] 
 * @param {string|Date} [to] 
 * @param {string} [location] 
 * @returns {Promise<object>}
 */
export async function getDashboardData(from, fromDateStr, toDateStr, location) {
  const todayBounds = getKolkataDayBounds(new Date());

  // 1. Calculate active bounds
  let start, end, activePeriodType;
  if (fromDateStr && toDateStr) {
    start = getKolkataDayBounds(fromDateStr).start;
    end = getKolkataDayBounds(toDateStr).end;
    activePeriodType = 'custom';
  } else {
    const weekBounds = getKolkataPeriodBounds('week');
    start = weekBounds.start;
    end = weekBounds.end;
    activePeriodType = 'week';
  }

  const weekBounds = getKolkataPeriodBounds('week');
  const monthBounds = getKolkataPeriodBounds('month');
  const yearBounds = getKolkataPeriodBounds('year');

  // Maximum query span is either the year bounds, today bounds, or custom range bounds
  const queryStart = start < yearBounds.start ? start : yearBounds.start;
  const queryEnd = end > todayBounds.end ? end : todayBounds.end;

  // 2. Fetch all attendances in query span and populate visitors
  const attendances = await Attendance.find({
    timestamp: { $gte: queryStart, $lte: queryEnd }
  }).populate('visitor');

  const validAttendances = attendances.filter(a => a.visitor);

  // 3. Find first-ever check-ins for all active visitors in memory/db
  const activeVisitorIds = [...new Set(validAttendances.map(a => a.visitor._id))];
  const firstVisitsMap = await buildFirstVisitsMap(activeVisitorIds);

  // 4. Calculate period stats
  const activePeriodStats = getStatsForPeriod(validAttendances, start, end, location, firstVisitsMap);
  const todayStats = getStatsForPeriod(validAttendances, todayBounds.start, todayBounds.end, location, firstVisitsMap);
  const weekStats = getStatsForPeriod(validAttendances, weekBounds.start, weekBounds.end, location, firstVisitsMap);
  const monthStats = getStatsForPeriod(validAttendances, monthBounds.start, monthBounds.end, location, firstVisitsMap);
  const yearStats = getStatsForPeriod(validAttendances, yearBounds.start, yearBounds.end, location, firstVisitsMap);

  // 5. Filter new users in active period
  const newUsersInPeriod = [];
  const activePeriodPhones = new Set();

  const activeFiltered = validAttendances.filter(a => {
    const timeMatch = a.timestamp >= start && a.timestamp <= end;
    const locMatch = !location || a.location === location;
    return timeMatch && locMatch;
  });

  activeFiltered.forEach(a => {
    activePeriodPhones.add(getCanonicalPhoneKey(a.visitor.phoneNumber));
  });

  activePeriodPhones.forEach(key => {
    const fv = firstVisitsMap.get(key);
    if (fv && fv.timestamp >= start && fv.timestamp <= end) {
      newUsersInPeriod.push({
        phone: key,
        timestamp: fv.timestamp,
        purpose: fv.purpose,
        college: fv.college,
        iAm: fv.iAm
      });
    }
  });

  // 6. Build trend chart data
  const diffMs = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffMs / (24 * 60 * 60 * 1000));

  const buckets = [];
  const bucketMap = new Map();

  if (diffDays <= 32) {
    const current = new Date(start);
    while (current <= end) {
      const label = formatKolkataDate(current, 'MMM DD');
      if (!bucketMap.has(label)) {
        bucketMap.set(label, 0);
        buckets.push(label);
      }
      current.setDate(current.getDate() + 1);
    }
  } else {
    const current = new Date(start);
    while (current <= end) {
      const label = formatKolkataDate(current, 'MMM YYYY');
      if (!bucketMap.has(label)) {
        bucketMap.set(label, 0);
        buckets.push(label);
      }
      current.setMonth(current.getMonth() + 1);
    }
  }

  newUsersInPeriod.forEach(user => {
    const label = formatKolkataDate(user.timestamp, diffDays <= 32 ? 'MMM DD' : 'MMM YYYY');
    if (bucketMap.has(label)) {
      bucketMap.set(label, bucketMap.get(label) + 1);
    }
  });

  const newUsersTrend = buckets.map(label => ({
    date: label,
    count: bucketMap.get(label)
  }));

  // 7. Group demographics
  const purposeCounts = {};
  const collegeCounts = {};
  const visitorTypeCounts = {};

  newUsersInPeriod.forEach(user => {
    const p = user.purpose || 'Other';
    purposeCounts[p] = (purposeCounts[p] || 0) + 1;

    const c = user.college || 'Other';
    collegeCounts[c] = (collegeCounts[c] || 0) + 1;

    const i = user.iAm || 'Other';
    visitorTypeCounts[i] = (visitorTypeCounts[i] || 0) + 1;
  });

  const purpose = Object.entries(purposeCounts).map(([name, value]) => ({ name, value }));
  const colleges = Object.entries(collegeCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  const visitorTypes = Object.entries(visitorTypeCounts).map(([name, value]) => ({ name, value }));

  // 8. Period-over-period comparison stats
  const duration = end.getTime() - start.getTime() + 1;
  const prevStart = new Date(start.getTime() - duration);
  const prevEnd = new Date(start.getTime() - 1);
  const previousPeriodStats = getStatsForPeriod(validAttendances, prevStart, prevEnd, location, firstVisitsMap);

  // 9. Generate Insights
  const insights = generateInsights(newUsersInPeriod, activePeriodStats, previousPeriodStats);

  return {
    overview: {
      totalNewUsers: activePeriodStats.newUsers,
      totalVisits: activePeriodStats.totalVisits,
      visitorsToday: todayStats.visitors,
      newVisitorsToday: todayStats.newUsers,
      returningVisitorsToday: todayStats.returningUsers
    },
    newUsersTrend,
    today: {
      total: todayStats.visitors,
      new: todayStats.newUsers,
      returning: todayStats.returningUsers
    },
    purpose,
    colleges,
    visitorTypes,
    summary: {
      week: weekStats,
      month: monthStats,
      year: yearStats,
      ...(activePeriodType === 'custom' && { custom: activePeriodStats })
    },
    insights
  };
}
