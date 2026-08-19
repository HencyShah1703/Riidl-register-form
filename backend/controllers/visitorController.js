import Visitor from '../model/Visitor.js';
import Attendance from '../model/Attendance.js';

// @desc    Search visitor by phone number
// @route   GET /api/visitors/search
// @access  Public
export const searchVisitor = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const searchPhone = phone.trim();
    const visitor = await Visitor.findOne({ phoneNumber: searchPhone });

    if (!visitor) {
      return res.status(404).json({ message: 'Visitor not registered yet' });
    }

    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Record a visitor check-in (saves user profile to Visitor collection, and log to Attendance collection)
// @route   POST /api/visitors/checkin
// @access  Public
export const checkIn = async (req, res) => {
  try {
    const { name, email, phoneNumber, collegeName, purposeOfVisit, location, iAm, mentorName, personToMeet } = req.body;

    if (!name || !email || !phoneNumber || !collegeName || !purposeOfVisit || !iAm || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // 1. Find or create visitor profile
    let visitor = await Visitor.findOne({ phoneNumber: phoneNumber.trim() });
    if (visitor) {
      // Update details in case they changed during verification/edit
      visitor.name = name.trim();
      visitor.email = email.trim();
      visitor.collegeName = collegeName.trim();
      visitor.iAm = iAm.trim();
      await visitor.save();
    } else {
      visitor = await Visitor.create({
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        collegeName: collegeName.trim(),
        iAm: iAm.trim()
      });
    }

    // 2. Create attendance check-in record
    const attendance = await Attendance.create({
      visitor: visitor._id,
      purposeOfVisit: purposeOfVisit.trim(),
      mentorName: mentorName ? mentorName.trim() : undefined,
      personToMeet: personToMeet ? personToMeet.trim() : undefined,
      location: location.trim(),
      timestamp: new Date()
    });

    res.status(201).json({
      message: 'Check-in recorded successfully',
      attendance: {
        _id: attendance._id,
        name: visitor.name,
        email: visitor.email,
        phoneNumber: visitor.phoneNumber,
        collegeName: visitor.collegeName,
        iAm: visitor.iAm,
        purposeOfVisit: attendance.purposeOfVisit,
        mentorName: attendance.mentorName || '',
        personToMeet: attendance.personToMeet || '',
        location: attendance.location,
        timestamp: attendance.timestamp
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all attendance log records (populates visitor details)
// @route   GET /api/visitors/records
// @access  Private (Admin Only)
export const getAllRecords = async (req, res) => {
  try {
    // Retrieve attendance records, populating visitor profiles
    const records = await Attendance.find({}).populate('visitor').sort({ timestamp: -1 });

    // Format output to match flat representation for the frontend
    const formattedRecords = records
      .filter(record => record.visitor) // remove orphaned entries
      .map(record => ({
        _id: record._id,
        name: record.visitor.name,
        email: record.visitor.email,
        phoneNumber: record.visitor.phoneNumber,
        collegeName: record.visitor.collegeName,
        iAm: record.visitor.iAm || '',
        purposeOfVisit: record.purposeOfVisit,
        mentorName: record.mentorName || '',
        personToMeet: record.personToMeet || '',
        location: record.location,
        timestamp: record.timestamp
      }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
