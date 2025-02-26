import React from 'react'
import axios from 'axios'

export const columns = [
    {
      name: "S No.",
      selector: (row) => row.sno,
      sortable: true,
      width: "86px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "130px", 
    },
    {
      name: "Department",
      selector: (row) => row.dep_name,
      width: "110px",
    },
    {
      name: "Action",
      selector: (row) => row.action,
      center: "true",
    },
  ] 

export const AttendancesHelper = ({status, employeeId, statusChange}) => {
  const markEmployee = async (status, employeeId) => {
    const response = await axios.put(`http://localhost:5000/api/attendances/update/${employeeId}`, {status}, {
      headers: { 
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
    })
      if(response.data.success){
        statusChange()
      }
  }
  return (
    <div>
        {status == null ? (
            <div  className="flex space-x-3">
                <button className='px-4 py-1.5 bg-green-500 text-white'
                onClick={() => markEmployee("present", employeeId)}>
                  Present
                  </button>
                <button className='px-4 py-1.5 bg-red-500 text-white'
                onClick={() => markEmployee("absent", employeeId)}>
                  Absent

                </button>
                <button className='px-4 py-1.5 bg-gray-500 text-white'
                onClick={() => markEmployee("sick", employeeId)}>
                  Sick

                </button>
                <button className='px-4 py-1.5 bg-yellow-500 text-black'
                onClick={() => markEmployee("leave", employeeId)}>
                  Leave

                </button>
            </div>
        ) : (
            <p className='bg-gray-100 w-20 text-center py-2 rounded'>{status}</p>
        )}
    </div>
  )
}
