import mongoose from "mongoose";

const AttendancesSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    employeeName: { type: String, required: true },
    departmentName: { type: String, required: true },
    date: { type: String, required: true },
    status: {
        type: String,
        enum: ["Present", "Absent", "Sick", "Leave"],
        default: null,
    },
});

const Attendances = mongoose.model("Attendances", AttendancesSchema);
export default Attendances;
