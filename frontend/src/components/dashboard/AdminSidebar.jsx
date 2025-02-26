import React from 'react'
import {NavLink} from 'react-router-dom'
import {FaBuilding, FaCalendarAlt, FaTachometerAlt, FaUsers, FaMoneyBillWave, FaCogs, FaRegCalendarAlt, FaFilePdf} from 'react-icons/fa'
import {AiOutlineFileText} from 'react-icons/ai'
const AdminSidebar = () => {
  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
        <div className='bg-teal-600 h-16 flex items-center justify-center'>
            <h2 className='text-2xl text-center font-courgette'>Employee Managment System</h2>
        </div>
        <div className='px-4'>
            <NavLink to="/admin-dashboard"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}
                end
                >
                <FaTachometerAlt/>
                <span>Dashboard</span>
            </NavLink>
            <NavLink to="/admin-dashboard/employees"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                <FaUsers/>
                <span>Employees</span>
            </NavLink>
            <NavLink to="/admin-dashboard/departments"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                <FaBuilding/>
                <span>Departments</span>
            </NavLink>
            <NavLink to="/admin-dashboard/leaves"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                <FaCalendarAlt/>
                <span>Leaves</span>
            </NavLink>
            <NavLink to="/admin-dashboard/salary/add"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                <FaMoneyBillWave/>
                <span>Salary</span>
            </NavLink>
            <NavLink to="/admin-dashboard/attendances"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}
                end
                >
                <FaRegCalendarAlt/>
                <span>Attendances</span>
            </NavLink>
            <NavLink to="/admin-dashboard/attendances-report"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}
                end
                >
                <FaFilePdf/>
                <span>Attendances Report</span>
            </NavLink>
            <NavLink to="/admin-dashboard/setting"
                className={({isActive}) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                <FaCogs/>
                <span>Settings</span>
            </NavLink>
        </div>
    </div>
  )
}

export default AdminSidebar
