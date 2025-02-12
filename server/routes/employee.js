import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import { addEmployee, getEmployees, upload, getEmployee, updateEmployee, fetchEmployeesByDepId } from '../controllers/employeeController.js';

const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single('image'), addEmployee)
router.put('/:id', authMiddleware, updateEmployee)
router.get('/:id', authMiddleware, getEmployee)
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)

export default router