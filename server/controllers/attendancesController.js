import Attendances from "../models/Attendances.js";
import Employee from "../models/Employee.js";

const getAttendances = async (req, res) => {
    try {
        const date = new Date().toISOString().split("T")[0];

        const attendances = await Attendances.find({ date }).populate({
            path: "employeeId",
            populate: ["department", "userId"],
        });

        const validAttendances = attendances.filter((att) => att.employeeId !== null);

        res.status(200).json({ success: true, attendances: validAttendances });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { status } = req.body;

        const employee = await Employee.findById(employeeId);
        if (!employee || employee.status === "deleted") {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Employee record not found. Attendance update not possible.",
                });
        }

        const date = new Date().toISOString().split("T")[0];
        const attendance = await Attendances.findOneAndUpdate(
            { employeeId, date },
            { $set: { status } },
            { new: true }
        );

        if (!attendance) {
            return res
                .status(404)
                .json({ success: false, message: "Attendance record not found." });
        }

        res.status(200).json({ success: true, attendance });
    } catch (error) {
        console.error("Error in updateAttendance:", error);
        res.status(500).json({ success: false, message: "Error updating attendance." });
    }
};

const attendancesReport = async (req, res) => {
    try {
        const skip = parseInt(req.query.skip) || 0;
        const targetDate = req.query.date; // Capture the date filter

        let uniqueDatesQuery = [
            { $group: { _id: "$date", count: { $sum: 1 } } },
            { $sort: { _id: -1 } },
        ];

        if (!targetDate) {
            uniqueDatesQuery.push({ $skip: skip }, { $limit: 1 });
        }

        const uniqueDates = await Attendances.aggregate(uniqueDatesQuery);

        if (uniqueDates.length === 0) {
            return res.status(200).json({ success: true, groupData: {} });
        }

        const dateToFetch = targetDate || uniqueDates[0]._id;

        const attendancesData = await Attendances.find({ date: dateToFetch })
            .populate({
                path: "employeeId",
                populate: ["department", "userId"],
            })
            .sort({ date: -1 });

        const validAttendancesData = attendancesData.filter(
            (record) => record.employeeId !== null
        );

        const groupData = {
            [dateToFetch]: validAttendancesData.map((record) => ({
                employeeId: record.employeeId?.employeeId || "Unknown",
                employeeName: record.employeeId?.userId?.name || "Unknown",
                departmentName: record.employeeId?.department?.dep_name || "Unknown",
                status: record.status || "Not Marked",
            })),
        };

        return res.status(200).json({ success: true, groupData });
    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
    }
};

export { getAttendances, updateAttendance, attendancesReport };
