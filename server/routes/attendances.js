import express from 'express'
import { attendancesReport, getAttendances, updateAttendance } from '../controllers/attendancesController.js';
import authMiddleware from './../middleware/authMiddleware.js';
import defaultAttendances from '../middleware/defaultAttendances.js';

const router = express.Router()

router.get('/', authMiddleware, defaultAttendances, getAttendances)
router.put('/update/:employeeId', authMiddleware, updateAttendance)
router.get('/reports', authMiddleware, attendancesReport)

export default router;