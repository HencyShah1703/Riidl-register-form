import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visitor',
      required: true
    },
    purposeOfVisit: {
      type: String,
      required: true,
      trim: true
    },
    mentorName: {
      type: String,
      trim: true
    },
    personToMeet: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      default: 'Riidl HQ',
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }
);

// Indexes for optimization
attendanceSchema.index({ timestamp: -1 });
attendanceSchema.index({ visitor: 1, timestamp: 1 });
attendanceSchema.index({ location: 1, timestamp: -1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
