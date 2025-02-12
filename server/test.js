import mongoose from "mongoose";
import Department from "./models/Department.js";

mongoose.connect("mongodb://localhost:27017/ems", {
}).then(async () => {
    const departments = await Department.find({});
    console.log(departments);
    mongoose.disconnect();
}).catch(err => console.error(err));
