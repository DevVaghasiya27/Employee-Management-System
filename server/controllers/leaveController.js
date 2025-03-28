import Employee from "../models/Employee.js";
import Leave from "../models/Leave.js";
import nodemailer from "nodemailer";
import User from '../models/User.js';

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to send email notification
const sendEmail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        });
        console.log("Email sent successfully to", to);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// Add Leave Request
const addLeave = async (req, res) => {
    try {
        const { userId, leaveType, startDate, endDate, reason } = req.body;

        // Fetch employee details from Employee collection
        const employee = await Employee.findOne({ userId });

        if (!employee) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        // Fetch user details to get the employee's name
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Create new Leave document
        const newLeave = new Leave({
            employeeId: employee._id,
            customEmployeeId: employee.employeeId, // Employee's custom ID from Employee schema
            employeeName: user.name, // Employee's name from User schema
            leaveType,
            startDate,
            endDate,
            reason,
        });

        await newLeave.save();

        return res.status(200).json({ success: true, message: "Leave request added successfully" });
    } catch (error) {
        console.error("Error in addLeave:", error); // Log error details for debugging
        return res.status(500).json({ success: false, error: "Add leave server error" });
    }
};

// Get Leave Requests
const getLeave = async (req, res) => {
    try {
        const { id, role } = req.params;
        let leaves;
        if (role === "admin") {
            leaves = await Leave.find({ employeeId: id });
        } else {
            const employee = await Employee.findOne({ userId: id });
            leaves = await Leave.find({ employeeId: employee._id });
        }

        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Get leave server error" });
    }
};

// Get All Leaves
const getLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find().populate({
            path: "employeeId",
            populate: [
                { path: 'department', select: 'dep_name' },
                { path: 'userId', select: 'name email' } // Ensure email is fetched
            ]
        });

        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Get leaves server error" });
    }
};

// Get Leave Details
const getLeavesDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const leave = await Leave.findById(id).populate({
            path: "employeeId",
            populate: [
                { path: 'department', select: 'dep_name' },
                { path: 'userId', select: 'name email profileImage' } // Fetch email for notifications
            ]
        });

        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" });
        }

        return res.status(200).json({ success: true, leave });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Leave details server error" });
    }
};

// Update Leave Status and Send Email
const updateLeave = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Find leave request
        const leave = await Leave.findById(id).populate({
            path: "employeeId",
            populate: {
                path: "userId",
                select: "email name"
            }
        });

        if (!leave) {
            return res.status(404).json({ success: false, error: "Leave not found" });
        }

        // Update status in database
        leave.status = status;
        await leave.save();

        // Send quick response to frontend first
        res.status(200).json({ success: true });

        // Now send email asynchronously
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: leave.employeeId.userId.email,
            subject: `Leave Request ${status}`,
            text: `Hello ${leave.employeeId.userId.name},\n\nYour leave request has been ${status}.\n\nRegards,\nAdmin`
        };

        transporter.sendMail(mailOptions)
            .then(info => console.log("Email sent:", info.response))
            .catch(error => console.log("Error sending email:", error));

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Leave update server error" });
    }
};

export { addLeave, getLeave, getLeaves, getLeavesDetails, updateLeave };
