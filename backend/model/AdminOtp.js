import mongoose from 'mongoose';

const adminOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    otp: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300 // Expiration time in seconds (5 minutes)
    }
  }
);


const AdminOtp = mongoose.model('AdminOtp', adminOtpSchema);
export default AdminOtp;
