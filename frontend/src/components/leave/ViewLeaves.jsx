import React, { useEffect, useState } from 'react'
import { columns, LeaveButtons } from '../../utils/LeaveHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const ViewLeaves = () => {
    const [leaves, setLeaves] = useState(null)
    const [filteredLeaves, setFilteredLeaves] = useState(null)

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(
              'http://localhost:5000/api/leave/', 
              {
              headers: { 
                Authorization: `Bearer ${localStorage.getItem('token')}` 
              }
              });
            if (response.data.success) {
              let sno = 1;
              const data = await response.data.leaves.map((leave) => ({
                _id: leave._id,
                sno: sno++,
                employeeId: leave.employeeId.employeeId,
                name: leave.employeeId.userId.name, 
                leaveType: leave.leaveType,
                department: leave.employeeId.department.dep_name,
                days:new Date(leave.endDate).getDate() - new Date(leave.startDate).getDate(),
                status: leave.status,
                action: (<LeaveButtons _id={leave._id}/>),
              }));
              setLeaves(data);
              setFilteredLeaves(data);
            }
          } catch (error) {
            if (error.response && !error.response.data.success) {
              alert(error.response.data.error);
            }
          }
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    const filterByInput = (e) => {
      const data = leaves.filter((leave) => 
        leave.employeeId
        .toLowerCase()
        .includes(e.target.value.toLowerCase())
      );
      setFilteredLeaves(data);
    };

    const filterByButton = (status) => {
      const data = leaves.filter((leave) => 
        leave.status
        .toLowerCase()
        .includes(status.toLowerCase())
      );
      setFilteredLeaves(data);
    };

  return (
    <>
    {filteredLeaves ? (
    <div className='p-6'>
            <div className='text-center'>
                <h3 className='text-2xl font-bold'>Manage Leaves</h3>
            </div>
            <div className='flex justify-between items-center pb-2'>
                <input
                type="text"
                placeholder='Search By Employee ID'
                className="px-4 py-0.5 border"
                onChange={filterByInput}
                />
                <div className='space-x-3'>
                <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded'
                onClick={() => filterByButton("Pending")}>
                  Pending
                </button>
                <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded'
                onClick={() => filterByButton("Approved")}>
                  Approved
                </button>
                <button className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded'
                onClick={() => filterByButton("Rejected")}>
                  Rejected
                </button>
                </div>
                </div>
                <DataTable columns={columns} data={filteredLeaves} pagination/>
                </div>
            ) : <div>Loaading...</div>}
            </>
            )
        }
        
export default ViewLeaves