import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/dashboard/Navbar'
import EmployeeSidebar from '../components/employeeDashboard/EmployeeSidebar'
function EmployeeDashboard() {
  return (
    <div className='flex'>
      <EmployeeSidebar />
      <div className='flex-1 ml-64 bg-gray-100 h-screen'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default EmployeeDashboard
