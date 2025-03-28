import Attendances from "../models/Attendances.js";
import Employee from "../models/Employee.js";

const defaultAttendances = async (req, res, next) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const existingAttendances = await Attendances.findOne({ date });

        if (!existingAttendances) {
            const employees = await Employee.find({}).populate("department userId");
            if (employees.length === 0) {
                console.log("No employees found, skipping attendance creation.");
            } else {
                const attendances = employees.map(employee => ({
                    date,
                    employeeId: employee._id, // Keep reference (optional)
                    employeeName: employee.userId.name, // Store employee name
                    departmentName: employee.department.dep_name, // Store department
                    status: null,
                }));
                await Attendances.insertMany(attendances);
                console.log("Default attendances added.");
            }
        }
        next();  // Ensure request moves forward
    } catch (error) {
        console.error("Error in defaultAttendances:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export default defaultAttendances;
