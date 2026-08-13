import Visitor from '../model/Visitor.js';
import Attendance from '../model/Attendance.js';
import AdminOtp from '../model/AdminOtp.js';
import nodemailer from 'nodemailer';

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
    const { name, email, phoneNumber, collegeName, purposeOfVisit, location, iAm } = req.body;

    if (!name || !email || !phoneNumber || !collegeName || !purposeOfVisit || !iAm) {
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
      location: location ? location.trim() : 'Riidl HQ',
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
    const { adminEmail } = req.query;

    if (!adminEmail || adminEmail.trim().toLowerCase() !== 'hency.shah@somaiya.edu') {
      return res.status(403).json({ message: 'Access Denied: Authorized Admin Only' });
    }

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
        location: record.location,
        timestamp: record.timestamp
      }));

    res.status(200).json(formattedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP to Admin email
// @route   POST /api/visitors/admin/send-otp
// @access  Public
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || email.trim().toLowerCase() !== 'hency.shah@somaiya.edu') {
      return res.status(403).json({ message: 'Access Denied: Authorized Admin Only' });
    }

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB, update if exists
    await AdminOtp.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send email using Nodemailer (prefers port 587 with STARTTLS which is open on most ISPs)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false // bypass SSL verification issues in local systems
      }
    });

    const mailOptions = {
      from: `"RIIDL Attendance" <${process.env.EMAIL_USER}>`,
      to: email.trim().toLowerCase(),
      subject: 'RIIDL Attendance - Admin OTP Code',
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; max-width: 500px;">
          <h2 style="color: #A20202;">RIIDL Attendance System</h2>
          <p>You have requested access to the visitor attendance records database.</p>
          <p>Please use the following 6-digit One-Time Password (OTP) to complete your verification:</p>
          <div style="font-size: 24px; font-weight: bold; background: #f3f4f6; padding: 15px; text-align: center; border-radius: 8px; letter-spacing: 5px; margin: 20px 0; border: 1px solid #d1d5db; color: #A20202;">
            ${otp}
          </div>
          <p style="font-size: 0.85rem; color: #6b7280;">This code is valid for 5 minutes. If you did not request this code, please ignore this email.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`[Admin OTP] Code ${otp} successfully sent to ${email}`);
      res.status(200).json({ message: 'OTP sent successfully to your email.' });
    } catch (mailError) {
      console.error('Nodemailer Error: Failed to send email.', mailError);
      // Fallback logging for testing purposes so that if credentials are not configured, they can still verify!
      console.log(`\n============================================\n[DEVELOPER FALLBACK - OTP CODE]: ${otp}\n============================================\n`);
      return res.status(500).json({ message: 'failed to send OTP' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP for Admin access
// @route   POST /api/visitors/admin/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    if (email.trim().toLowerCase() !== 'hency.shah@somaiya.edu') {
      return res.status(403).json({ message: 'Access Denied: Authorized Admin Only' });
    }

    const storedRecord = await AdminOtp.findOne({ email: email.trim().toLowerCase() });

    if (!storedRecord) {
      return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' });
    }

    if (storedRecord.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP code. Please try again.' });
    }

    // Delete used OTP
    await AdminOtp.deleteOne({ _id: storedRecord._id });

    res.status(200).json({ message: 'OTP verified successfully', verified: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
