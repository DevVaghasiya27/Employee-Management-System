import React, { useEffect, useState } from 'react'
import SummaryCard from './SummaryCard'
import { FaBuilding, FaCheckCircle, FaFileAlt, FaHourglassHalf, FaMoneyBillWave, FaTimesCircle, FaUsers } from 'react-icons/fa'
import axios from 'axios';
import { NavLink } from 'react-router-dom';
const AdminSummary = () => {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const summary = await axios.get('http://localhost:5000/api/dashboard/summary', {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          }
        })
        setSummary(summary.data)
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error)
        }
        console.log(error.message)
      }
    }
    fetchSummary()
  }, [])

  if (!summary) {
    return <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-teal-600 border-dashed rounded-full animate-spin"></div>
        <div className="text-teal-600 font-bold text-lg mt-4">Loading...</div>
      </div>
    </div>
  }

  return (
    <div className='p-6'>
      <h2 className="text-2xl font-bold text-teal-600">Dashboard Overview</h2>
      <div className='grid grid-cols md:grid-cols-3 gap-4 mt-6'>
        <NavLink to="/admin-dashboard/employees">
          <SummaryCard icon={<FaUsers />} text="Total Employees" number={summary.totalEmployees} color="bg-teal-600" />
        </NavLink>
        <NavLink to="/admin-dashboard/departments">
          <SummaryCard icon={<FaBuilding />} text="Total Departments" number={summary.totalDepartments} color="bg-yellow-600" />
        </NavLink>
        <NavLink to="/admin-dashboard/salary/add">
          <SummaryCard icon={<FaMoneyBillWave />} text="Monthly Salary" number={summary.totalSalaries} color="bg-red-600" />
        </NavLink>
      </div>
      <div className="mt-12">
        <h4 className='text-center text-2xl font-bold text-teal-600'>Leave Details</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <NavLink to="/admin-dashboard/leaves">
            <SummaryCard icon={<FaFileAlt />} text="Leave Applied" number={summary.leaveSummary.appliedFor} color="bg-teal-600" />
          </NavLink>
          <NavLink to="/admin-dashboard/leaves">
            <SummaryCard icon={<FaCheckCircle />} text="Leave Approved" number={summary.leaveSummary.approved} color="bg-green-600" />
          </NavLink>
          <NavLink to="/admin-dashboard/leaves">
            <SummaryCard icon={<FaHourglassHalf />} text="Leave Pending" number={summary.leaveSummary.pending} color="bg-yellow-600" />
          </NavLink>
          <NavLink to="/admin-dashboard/leaves">
            <SummaryCard icon={<FaTimesCircle />} text="Leave Rejected" number={summary.leaveSummary.rejected} color="bg-red-600" />
          </NavLink>
        </div>
      </div>

    </div>
  )
}

export default AdminSummary
