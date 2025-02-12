import Department from "../models/Department.js";

const getDepartments = async (req,res) => {
    try{
        const departments = await Department.find({})
        return res.status(200).json({success: true, departments})
    } catch(error){
        return res.status(500).json({success: false, error: "get department server errror"})
    }
}

const addDepartment = async (req, res) => {
    try{
        const {dep_name, description} = req.body;
        const newDep = new Department({
            dep_name,
            description
        })
        console.log(newDep)
        await newDep.save()
        return res.status(200).json({success: true, department: newDep})
    }catch(error){
        return res.status(500).json({success: false, error: "add department server errror"})
    }
}

const getDepartment = async (req, res) => {
    try{
        const {id} = req.params;
        const department = await Department.findById({_id: id});
        return res.status(200).json({success: true, department})
    } catch(error){
        return res.status(500).json({success: false, error: "get departments server errror"})
    }
}

const updateDepartment = async (req, res) => {
    try{
        const {id} = req.params;
        const {dep_name, description} = req.body;
        const updatedDep = await Department.findByIdAndUpdate({_id: id}, {dep_name, description});
        return res.status(200).json({success: true, updatedDep})
    } 
    catch(error){
        return res.status(500).json({success: false, error: "edit department server errror"})
    }
}

const deleteDepartment = async (req, res) => {
    try{
        const {id} = req.params;
        const deleteDep = await Department.findById({_id: id});
        await deleteDep.deleteOne()
        return res.status(200).json({success: true, deleteDep})
    } 
    catch(error){
        return res.status(500).json({success: false, error: "edit department server errror"})
    }
}

export {addDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment}