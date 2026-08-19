import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Visitor from '../model/Visitor.js';
import Attendance from '../model/Attendance.js';
import { getDashboardData } from '../services/analyticsService.js';
import { getKolkataDayBounds } from '../utils/analyticsDateUtils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load dotenv from backend folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/riidl_attendance';

async function runTests() {
  try {
    console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for testing.');

    // Clear collections for test isolation
    await Visitor.deleteMany({});
    await Attendance.deleteMany({});
    console.log('Cleared existing visitors and attendances.');

    // 1. Create Visitor 1 (+91 9876543210)
    const v1 = await Visitor.create({
      name: 'Hency Shah',
      email: 'hency.shah@somaiya.edu',
      phoneNumber: '+919876543210',
      collegeName: 'K J Somaiya School of Engineering',
      iAm: 'Student'
    });

    const todayBounds = getKolkataDayBounds(new Date());
    
    const getRelativeDateBounds = (daysAgo) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return getKolkataDayBounds(d);
    };

    const pastBounds1 = getRelativeDateBounds(11); // e.g. 11 days ago
    const pastBounds2 = getRelativeDateBounds(7);  // e.g. 7 days ago
    const todayTargetBounds = todayBounds;         // today

    // Test 1: Phone 1111 visits 11 days ago, 7 days ago, today.
    await Attendance.create({
      visitor: v1._id,
      purposeOfVisit: 'Meeting',
      location: 'Riidl HQ',
      timestamp: pastBounds1.start // 11 days ago
    });

    await Attendance.create({
      visitor: v1._id,
      purposeOfVisit: 'Meeting',
      location: 'Riidl HQ',
      timestamp: pastBounds2.start // 7 days ago
    });

    // Test 4: Phone checks in twice on the same day (today).
    await Attendance.create({
      visitor: v1._id,
      purposeOfVisit: 'Mentorship Session',
      location: 'Riidl HQ',
      timestamp: new Date(todayTargetBounds.start.getTime() + 2 * 60 * 60 * 1000) // Today 10:00 AM
    });

    await Attendance.create({
      visitor: v1._id,
      purposeOfVisit: 'Mentorship Session',
      location: 'Riidl HQ',
      timestamp: new Date(todayTargetBounds.start.getTime() + 7 * 60 * 60 * 1000) // Today 3:00 PM
    });

    // Test 3: Phone 2222 (equivalent format "+91 98123 45678") visits for the first time today.
    const v2 = await Visitor.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@somaiya.edu',
      phoneNumber: '+91 98123 45678', // equivalent format
      collegeName: 'K J Somaiya Institute of Management',
      iAm: 'Faculty'
    });

    await Attendance.create({
      visitor: v2._id,
      purposeOfVisit: 'Seminar / Workshop',
      location: 'Riidl HQ',
      timestamp: todayTargetBounds.start // today
    });

    // Run calculation for period (from 11 days ago to today)
    const data = await getDashboardData(null, pastBounds1.start, todayTargetBounds.end, 'Riidl HQ');

    console.log('\n--- VERIFICATION RESULTS ---');
    console.log('Data Overview:', JSON.stringify(data.overview, null, 2));
    console.log('Today Stats:', JSON.stringify(data.today, null, 2));

    const assert = (cond, msg) => {
      if (!cond) {
        console.error('\x1b[31m%s\x1b[0m', `FAIL: ${msg}`);
        process.exit(1);
      } else {
        console.log('\x1b[32m%s\x1b[0m', `PASS: ${msg}`);
      }
    };

    // Assertions based on rules
    // Total visits in period: 5 (2 on Aug 12, 1 on Aug 5, 1 on Aug 1, 1 for v2 on Aug 12)
    assert(data.overview.totalVisits === 5, `Total visits in period should be 5, got ${data.overview.totalVisits}`);
    
    // Total new users: 2 (Phone 1111 first checkin on Aug 1, Phone 2222 first checkin on Aug 12)
    assert(data.overview.totalNewUsers === 2, `Total new users in period should be 2, got ${data.overview.totalNewUsers}`);

    // Today's metrics (Aug 12):
    // Total unique visitors: 2 (Phone 1111 and 2222)
    assert(data.today.total === 2, `Visitors today should be 2, got ${data.today.total}`);
    // New today: 1 (Phone 2222, first visit Aug 12)
    assert(data.today.new === 1, `New visitors today should be 1, got ${data.today.new}`);
    // Already Registered today: 1 (Phone 1111, first visit Aug 1 - which is before Aug 12)
    assert(data.today.returning === 1, `Already registered visitors today should be 1, got ${data.today.returning}`);
    // Always enforce: Visitors Today = New Visitors Today + Already Registered Visitors Today
    assert(data.today.total === data.today.new + data.today.returning, 'Visitors Today = New Today + Already Registered Today');

    console.log('\n\x1b[32m%s\x1b[0m', 'All tests completed successfully!');
  } catch (error) {
    console.error('Test run failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runTests();
