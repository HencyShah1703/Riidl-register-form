import express from 'express';
import { searchVisitor, checkIn, getAllRecords } from '../controllers/visitorController.js';

const router = express.Router();

router.get('/search', searchVisitor);
router.post('/checkin', checkIn);
router.get('/records', getAllRecords);

export default router;
