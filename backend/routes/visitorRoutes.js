import express from 'express';
import { searchVisitor, checkIn, getAllRecords, sendOtp, verifyOtp } from '../controllers/visitorController.js';

const router = express.Router();

router.get('/search', searchVisitor);
router.post('/checkin', checkIn);
router.get('/records', getAllRecords);
router.post('/admin/send-otp', sendOtp);
router.post('/admin/verify-otp', verifyOtp);

export default router;
