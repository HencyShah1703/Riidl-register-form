import Airtable from 'airtable';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');
dotenv.config({ path: envPath });

/**
 * Helper to get Airtable configuration from environment variables
 */
const getApiKey = () => (process.env.AIRTABLE_API_KEY || '').trim();
const getBaseId = () => (process.env.AIRTABLE_BASE_ID || '').trim();
const getReceptionDataTable = () => (process.env.AIRTABLE_RECEPTION_DATA_TABLE || 'Reception-Data').trim();

/**
 * Returns an initialized Airtable base instance
 */
export const getAirtableBase = () => {
  const apiKey = getApiKey();
  const baseId = getBaseId();
  if (!apiKey) {
    throw new Error('AIRTABLE_API_KEY is not configured in backend environment variables.');
  }
  if (!baseId) {
    throw new Error('AIRTABLE_BASE_ID is not configured in backend environment variables.');
  }
  return new Airtable({ apiKey }).base(baseId);
};

/**
 * Normalizes phone number: formats with +91 country code by default if 10 digits
 * @param {string} phone
 * @returns {string}
 */
export const normalizePhoneNumber = (phone) => {
  if (!phone) return '';
  const trimmed = phone.trim();
  const digits = trimmed.replace(/\D/g, '');
  const last10 = digits.length > 10 ? digits.slice(digits.length - 10) : digits;
  if (trimmed.startsWith('+')) {
    return trimmed.replace(/[\s\-\(\)]/g, '');
  }
  if (last10.length === 10) {
    return `+91${last10}`;
  }
  return trimmed;
};

/**
 * Formats purpose of visit according to rules:
 * - Internship: "Internship - {mentorName}"
 * - To Meet Someone: "To Meet Someone - {personToMeet}"
 * - Other: custom purpose string (never "Other")
 * - Standard: exact dropdown option
 */
export const formatPurposeOfVisit = ({ purposeOfVisit, mentorName, personToMeet }) => {
  const p = (purposeOfVisit || '').trim();
  if (p.toLowerCase() === 'internship') {
    return mentorName && mentorName.trim() ? `Internship - ${mentorName.trim()}` : 'Internship';
  }
  if (p.toLowerCase() === 'to meet someone') {
    return personToMeet && personToMeet.trim() ? `To Meet Someone - ${personToMeet.trim()}` : 'To Meet Someone';
  }
  return p;
};

/**
 * Deconstructs combined purpose into base purpose and mentor/person
 */
export const parseFormattedPurpose = (combinedPurpose) => {
  if (!combinedPurpose) {
    return { purposeOfVisit: '', mentorName: '', personToMeet: '' };
  }
  const text = combinedPurpose.trim();
  if (text.toLowerCase().startsWith('internship - ')) {
    return {
      purposeOfVisit: 'Internship',
      mentorName: text.substring(13).trim(),
      personToMeet: ''
    };
  }
  if (text.toLowerCase().startsWith('to meet someone - ')) {
    return {
      purposeOfVisit: 'To Meet Someone',
      mentorName: '',
      personToMeet: text.substring(18).trim()
    };
  }
  return {
    purposeOfVisit: text,
    mentorName: '',
    personToMeet: ''
  };
};

/**
 * Searches the single Reception-Data table by phone number to auto-fill returning visitors
 * @param {string} phone
 * @returns {Promise<object|null>}
 */
export const searchVisitorByPhone = async (phone) => {
  if (!phone) return null;
  const base = getAirtableBase();
  const formattedPhone = normalizePhoneNumber(phone);
  const digitsOnly = phone.replace(/\D/g, '');
  const last10 = digitsOnly.length > 10 ? digitsOnly.slice(digitsOnly.length - 10) : digitsOnly;

  const formula = `OR({Phone Number} = '${formattedPhone}', {Phone Number} = '${phone.trim()}', {Phone Number} = '${last10}', {Phone Number} = '+91${last10}')`;

  const records = await base(getReceptionDataTable())
    .select({
      filterByFormula: formula,
      maxRecords: 1
    })
    .firstPage();

  if (!records || records.length === 0) {
    return null;
  }

  const record = records[0];
  return {
    _id: record.id,
    id: record.id,
    phoneNumber: record.get('Phone Number') || formattedPhone,
    name: record.get('Name') || '',
    email: record.get('Email') || '',
    collegeName: record.get('College Name') || '',
    iAm: record.get('I Am') || '',
    location: record.get('Location') || 'Riidl HQ'
  };
};

/**
 * Saves a new check-in visit by creating ONE new row in the single Reception-Data table.
 * Every visit creates a new row.
 */
export const saveCheckIn = async ({
  name,
  email,
  phoneNumber,
  collegeName,
  purposeOfVisit,
  location,
  iAm,
  mentorName,
  personToMeet
}) => {
  const base = getAirtableBase();
  const formattedPhone = normalizePhoneNumber(phoneNumber);
  const finalCollegeName = (collegeName || '').trim();
  const finalIAm = (iAm || '').trim();
  const finalPurpose = formatPurposeOfVisit({ purposeOfVisit, mentorName, personToMeet });
  const finalLocation = (location || 'Riidl HQ').trim();

  const fields = {
    'Phone Number': formattedPhone,
    'Name': (name || '').trim(),
    'Email': (email || '').trim(),
    'College Name': finalCollegeName,
    'I Am': finalIAm,
    'Purpose of Visit': finalPurpose,
    'Location': finalLocation
  };

  const createdRecord = await base(getReceptionDataTable()).create(fields, { typecast: true });
  const parsedPurpose = parseFormattedPurpose(finalPurpose);

  return {
    _id: createdRecord.id,
    name: (name || '').trim(),
    email: (email || '').trim(),
    phoneNumber: formattedPhone,
    collegeName: finalCollegeName,
    iAm: finalIAm,
    purposeOfVisit: parsedPurpose.purposeOfVisit,
    mentorName: mentorName ? mentorName.trim() : parsedPurpose.mentorName,
    personToMeet: personToMeet ? personToMeet.trim() : parsedPurpose.personToMeet,
    location: finalLocation,
    timestamp: createdRecord.get('TimeStamp') || createdRecord.get('Create Time') || createdRecord.createdTime || new Date().toISOString()
  };
};

/**
 * Retrieves all attendance records from Reception-Data for the Records view
 */
export const getAllAttendanceRecords = async () => {
  const base = getAirtableBase();
  const allRecords = [];

  await base(getReceptionDataTable())
    .select({
      pageSize: 100
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach(r => {
        const rawPurpose = r.get('Purpose of Visit') || '';
        const parsed = parseFormattedPurpose(rawPurpose);
        const timestampStr = r.get('TimeStamp') || r.get('Create Time') || r.createdTime || new Date().toISOString();

        allRecords.push({
          _id: r.id,
          name: r.get('Name') || '',
          email: r.get('Email') || '',
          phoneNumber: r.get('Phone Number') || '',
          collegeName: r.get('College Name') || '',
          iAm: r.get('I Am') || '',
          purposeOfVisit: parsed.purposeOfVisit,
          mentorName: parsed.mentorName,
          personToMeet: parsed.personToMeet,
          location: r.get('Location') || 'Riidl HQ',
          timestamp: timestampStr
        });
      });
      fetchNextPage();
    });

  // Sort descending by timestamp
  allRecords.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return allRecords;
};

/**
 * Retrieves all attendances populated with visitor details for analytics calculation
 */
export const getAllAttendancesForAnalytics = async () => {
  const base = getAirtableBase();
  const attendances = [];

  await base(getReceptionDataTable())
    .select({
      pageSize: 100
    })
    .eachPage((records, fetchNextPage) => {
      records.forEach(r => {
        const rawPurpose = r.get('Purpose of Visit') || '';
        const parsed = parseFormattedPurpose(rawPurpose);
        const timestampStr = r.get('TimeStamp') || r.get('Create Time') || r.createdTime || new Date().toISOString();

        attendances.push({
          _id: r.id,
          visitor: {
            _id: r.id,
            phoneNumber: r.get('Phone Number') || '',
            name: r.get('Name') || '',
            email: r.get('Email') || '',
            collegeName: r.get('College Name') || '',
            iAm: r.get('I Am') || ''
          },
          purposeOfVisit: parsed.purposeOfVisit,
          mentorName: parsed.mentorName,
          personToMeet: parsed.personToMeet,
          location: r.get('Location') || 'Riidl HQ',
          timestamp: new Date(timestampStr)
        });
      });
      fetchNextPage();
    });

  // Sort ascending by timestamp for chronological analytics computation
  attendances.sort((a, b) => a.timestamp - b.timestamp);

  return attendances;
};
