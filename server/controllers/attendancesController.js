import Attendances from "../models/Attendances.js";

const getAttendances = async (req,res) => {
    try {
    const date = new Date().toISOString().split('T')[0]

    const attendances = await Attendances.find({date}).populate({
        path: "employeeId",
        populate: [
            "department",
            "userId"
        ]
    })
    res.status(200).json({success: true, attendances})
    } catch (error) {
        res.status(500).json({success:false, message: error.message})
    }
}

const updateAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { status } = req.body;
        const date = new Date().toISOString().split('T')[0];
        console.log("Updating attendance for:", employeeId, "with status:", status);

        // Find attendance for this employee on the current date
        const attendance = await Attendances.findOne({ employeeId, date });

        if (!attendance) {
            return res.status(404).json({ success: false, message: "Attendance record not found" });
        }

        // Update attendance status
        const updatedAttendance = await Attendances.findOneAndUpdate(
            { employeeId, date },
            { status },
            { new: true }
        );

        res.status(200).json({ success: true, attendances: updatedAttendance });
    } catch (error) {
        console.error("Error in updateAttendance:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// const attendancesReport = async (req, res) => {
//     try{
//         const {date, limit = 5, skip = 0} = req.query;
//         const query = {};

//         if(date){
//             query.date = date;
//         }

//         const attendancesData = await Attendances.find(query)
//         .populate({
//             path: "employeeId",
//             populate: [
//                 "department",
//                 "userId"
//             ]
//         }).sort({date:-1}).limit(parseInt(limit)).skip(parseInt(skip))
    
//     const groupData = attendancesData.reduce((result, record) => {
//         if(!result[record.id]){
//             result[record.date] = []
//         }
//         result[record.date].push({
//             employeeId: record.employeeId.employeeId,
//             employeeName: record.employeeId.userId.name,
//             departmentName: record.employeeId.department.dep_name,
//             status: record.status || "Not Marked"
//         })
//         return result;
//     }, {})
//     return res.status(201).json({success: true, groupData})
// } catch(error){
//     res.status(500).json({ success: false, message: error.message });
//     }
// }

const attendancesReport = async (req, res) => {
    try {
        const { date, limit = 5, skip = 0 } = req.query;
        const query = {};

        if (date) {
            query.date = date;
        }

        const attendancesData = await Attendances.find(query)
            .populate({
                path: "employeeId",
                populate: ["department", "userId"],
            })
            .sort({ date: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        console.log("Fetched Attendances:", attendancesData); // Debugging

        const groupData = attendancesData.reduce((result, record) => {
            if (!result[record.date]) {
                result[record.date] = [];
            }
            result[record.date].push({
                employeeId: record.employeeId.employeeId,
                employeeName: record.employeeId.userId.name,
                departmentName: record.employeeId.department.dep_name,
                status: record.status || "Not Marked",
            });
            return result;
        }, {});

        return res.status(201).json({ success: true, groupData });
    } catch (error) {
        console.error("Error fetching attendance report:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


export {getAttendances, updateAttendance, attendancesReport}