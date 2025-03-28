import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js';
import { addEmployee, getEmployees, upload, getEmployee, updateEmployee, fetchEmployeesByDepId, deleteEmployee } from '../controllers/employeeController.js';

const router = express.Router()

router.get('/', authMiddleware, getEmployees)
router.post('/add', authMiddleware, upload.single('image'), addEmployee)
router.put('/:id', authMiddleware, upload.single('image'), updateEmployee);
router.get('/:id', authMiddleware, getEmployee)
router.get('/department/:id', authMiddleware, fetchEmployeesByDepId)
router.delete('/:id', authMiddleware, deleteEmployee);

export default router
