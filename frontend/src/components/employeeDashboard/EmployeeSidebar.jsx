import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaCalendarAlt, FaTachometerAlt, FaUsers, FaMoneyBillWave, FaCogs } from 'react-icons/fa'
import { useAuth } from '../../context/authContext'
import EMS from "/src/EMS.png";
const EmployeeSidebar = () => {
    const { user } = useAuth()
    return (
        <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
            <div className='bg-teal-600 h-20 flex items-center justify-center'>
                {/* <h2 className='text-2xl text-center font-courgette'>Employee Management System</h2> */}
                <NavLink to="/employee-dashboard"><img className='w-52' src={EMS} alt="" /></NavLink>
            </div>
            <div className='px-4'>
                <NavLink to="/employee-dashboard"
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}
                    end
                >
                    <FaTachometerAlt />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to={`/employee-dashboard/profile/${user._id}`}
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                    <FaUsers />
                    <span>My Profile</span>
                </NavLink>
                <NavLink to={`/employee-dashboard/leaves/${user._id}`}
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                    <FaCalendarAlt />
                    <span>Leaves</span>
                </NavLink>
                <NavLink to={`/employee-dashboard/salary/${user._id}`}
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                    <FaMoneyBillWave />
                    <span>Salary</span>
                </NavLink>
                <NavLink to="/employee-dashboard/setting"
                    className={({ isActive }) => `${isActive ? "bg-teal-500" : ""} flex items-center space-x-4 py-2.5 px-4 rounded`}>
                    <FaCogs />
                    <span>Setting</span>
                </NavLink>
            </div>
        </div>
    )
}

export default EmployeeSidebar
