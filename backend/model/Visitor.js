import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    collegeName: {
      type: String,
      required: true,
      trim: true
    },
    iAm: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
