import Salary from "../models/Salary.js"
import Employee from '../models/Employee.js'
import User from "../models/User.js";

const addSalary = async (req, res) => {
    try {
        const { employeeId, basicSalary, allowances, deductions, payDate } = req.body;

        // Fetch employee details from the Employee collection
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Fetch user details to get the employee's name
        const user = await User.findById(employee.userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Calculate net salary
        const totalSalary = Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

        // Create new Salary document
        const newSalary = new Salary({
            employeeId,
            employeeName: user.name, // Fetching name from User collection
            basicSalary,
            allowances,
            deductions,
            netSalary: totalSalary,
            payDate,
        });

        // Save the salary record in the database
        await newSalary.save();

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error in addSalary:", error); // Log error details
        return res.status(500).json({ success: false, error: "Add salary server error" });
    }
};


const getSalary = async (req, res) => {
    try {
        const { id, role } = req.params;

        let salary
        if (role === "admin") {
            salary = await Salary.find({ employeeId: id }).populate('employeeId', 'employeeId')
        } else {
            const employee = await Employee.findOne({ userId: id })
            salary = await Salary.find({ employeeId: employee._id }).populate('employeeId', 'employeeId')
        }
        return res.status(200).json({ success: true, salary })
    } catch (error) {
        return res.status(500).json({ success: false, error: "get salary server error" })
    }
}

export { addSalary, getSalary }
