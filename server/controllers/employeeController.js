import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import Attendances from "../models/Attendances.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

const addEmployee = async (req, res) => {
    try {
        const {
            name,
            email,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
            password,
            role,
        } = req.body;

        // Check if the email is already registered
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "User already registered in employee" });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Set default image if no file is uploaded
        const profileImage = req.file ? req.file.filename : "default.png"; // Default image

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashPassword,
            role,
            profileImage,
        });
        const savedUser = await newUser.save();

        // Create a new employee
        const newEmployee = new Employee({
            userId: savedUser._id,
            employeeId,
            dob,
            gender,
            maritalStatus,
            designation,
            department,
            salary,
        });
        await newEmployee.save();

        return res.status(200).json({ success: true, message: "Employee created" });
    } catch (error) {
        console.error("Add Employee Error:", error);
        return res.status(500).json({ success: false, error: "Add employee server error" });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().populate('userId', { password: 0 }).populate("department")
        return res.status(200).json({ success: true, employees })
    } catch (error) {
        return res.status(500).json({ success: false, error: "get employees server error" })
    }
}

const getEmployee = async (req, res) => {
    const { id } = req.params;
    try {
        let employee;
        employee = await Employee.findById({ _id: id }).populate('userId', { password: 0 }).populate("department")
        if (!employee) {
            employee = await Employee.findOne({ userId: id }).populate('userId', { password: 0 }).populate("department")
        }
        return res.status(200).json({ success: true, employee })
    } catch (error) {
        return res.status(500).json({ success: false, error: "get employees server error" })
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, maritalStatus, designation, department, salary } = req.body;

        // Find the employee and associated user
        const employee = await Employee.findById({ _id: id });
        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        const user = await User.findById({ _id: employee.userId });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Prepare updated user data
        const updatedUserData = { name };

        if (req.file) {
            // Ensure the user has a valid profileImage before proceeding
            if (user.profileImage && user.profileImage !== "default.png") {
                const oldImagePath = path.join(__dirname, "../public/uploads", user.profileImage);

                // Check if the old image file exists
                if (fs.existsSync(oldImagePath)) {
                    try {
                        await fs.promises.unlink(oldImagePath); // Delete the old image
                        console.log(`Deleted old image: ${oldImagePath}`);
                    } catch (err) {
                        console.error(`Error deleting old image: ${err.message}`);
                    }
                } else {
                    console.log(`Old image not found: ${oldImagePath}`);
                }
            } else {
                console.log("No previous image to delete or it's the default image.");
            }

            updatedUserData.profileImage = req.file.filename; // Update to new image
        }

        // Update User
        const updateUser = await User.findByIdAndUpdate(
            { _id: employee.userId },
            updatedUserData,
            { new: true }
        );

        // Update Employee
        const updateEmployee = await Employee.findByIdAndUpdate(
            { _id: id },
            { maritalStatus, designation, department, salary },
            { new: true }
        );

        // Response
        if (!updateEmployee || !updateUser) {
            return res.status(404).json({ success: false, error: "Document not found" });
        }

        return res.status(200).json({ success: true, message: "Employee updated successfully" });
    } catch (error) {
        console.error("Update Employee Error:", error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};

const fetchEmployeesByDepId = async (req, res) => {
    const { id } = req.params;
    try {
        const employees = await Employee.find({ department: id })
        return res.status(200).json({ success: true, employees })
    } catch (error) {
        return res.status(500).json({ success: false, error: "get employeesByDepId server error" })
    }
}

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Deleting Employee ID:", id); // Debug log

        // Check if employee exists
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ success: false, message: "Employee not found" });
        }

        // Delete user linked to employee
        const userDeleted = await User.findByIdAndDelete(employee.userId);
        console.log("User deleted:", userDeleted);

        // Delete the employee
        const employeeDeleted = await Employee.findByIdAndDelete(id);
        console.log("Employee deleted:", employeeDeleted);

        // Don't delete attendances & leaves, just unlink them
        await Attendances.updateMany({ employeeId: id }, { $set: { employeeId: null } });

        res.status(200).json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export { addEmployee, getEmployees, getEmployee, upload, updateEmployee, fetchEmployeesByDepId, deleteEmployee }
