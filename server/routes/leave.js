import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import { addLeave, getLeave, getLeaves, getLeavesDetails, updateLeave } from '../controllers/leaveController.js';

const router = express.Router()

router.post('/add', authMiddleware, addLeave)
router.get('/detail/:id', authMiddleware, getLeavesDetails)
router.get('/:id/:role', authMiddleware, getLeave)
router.get('/', authMiddleware, getLeaves)
router.put('/:id', authMiddleware, updateLeave)

export default router
