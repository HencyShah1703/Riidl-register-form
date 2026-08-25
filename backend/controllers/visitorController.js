import {
  searchVisitorByPhone,
  saveCheckIn,
  getAllAttendanceRecords
} from '../services/airtableService.js';

// Helper to extract clear error messages from Airtable / system errors
const formatErrorMessage = (error, defaultMsg) => {
  const msg = error.message || defaultMsg;
  if (msg.includes('AIRTABLE_API_KEY is not configured') || msg.includes('AIRTABLE_BASE_ID is not configured')) {
    return msg;
  }
  if (error.statusCode === 401 || error.error === 'AUTHENTICATION_REQUIRED' || msg.includes('api key') || msg.includes('authentication') || msg.includes('AIRTABLE_API_KEY')) {
    return 'Airtable authentication failed: Invalid, expired, or unauthorized AIRTABLE_API_KEY. Please verify your Airtable Personal Access Token in backend/.env';
  }
  if (error.statusCode === 404 || error.error === 'NOT_FOUND' || msg.includes('Could not find table') || msg.includes('Could not find base')) {
    return 'Airtable table or base not found. Please verify AIRTABLE_BASE_ID and AIRTABLE_RECEPTION_DATA_TABLE in backend/.env';
  }
  if (error.statusCode === 422 || error.error === 'INVALID_MULTIPLE_CHOICE_OPTIONS') {
    return `Airtable field format error: ${msg}`;
  }
  return msg;
};

// @desc    Search visitor by phone number from Airtable Reception-Data
// @route   GET /api/visitors/search
// @access  Public
export const searchVisitor = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const visitor = await searchVisitorByPhone(phone.trim());

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not registered yet' });
    }

    res.status(200).json(visitor);
  } catch (error) {
    console.error('Error searching visitor in Airtable:', error);
    res.status(error.statusCode || 500).json({ message: formatErrorMessage(error, 'Error searching visitor') });
  }
};

// @desc    Record a visitor check-in (creates a new row in Airtable Reception-Data)
// @route   POST /api/visitors/checkin
// @access  Public
export const checkIn = async (req, res) => {
  try {
    const { name, email, phoneNumber, collegeName, purposeOfVisit, location, iAm, mentorName, personToMeet } = req.body;

    if (!name || !email || !phoneNumber || !collegeName || !purposeOfVisit || !iAm || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const attendance = await saveCheckIn({
      name,
      email,
      phoneNumber,
      collegeName,
      purposeOfVisit,
      location,
      iAm,
      mentorName,
      personToMeet
    });

    res.status(201).json({
      message: 'Check-in recorded successfully',
      attendance
    });
  } catch (error) {
    console.error('Error recording check-in in Airtable:', error);
    res.status(error.statusCode || 500).json({ message: formatErrorMessage(error, 'Error recording check-in in Airtable') });
  }
};

// @desc    Get all attendance log records from Airtable Reception-Data
// @route   GET /api/visitors/records
// @access  Private (Admin Only)
export const getAllRecords = async (req, res) => {
  try {
    const formattedRecords = await getAllAttendanceRecords();
    res.status(200).json(formattedRecords);
  } catch (error) {
    console.error('Error fetching records from Airtable:', error);
    res.status(error.statusCode || 500).json({ message: formatErrorMessage(error, 'Error fetching records from Airtable') });
  }
};
