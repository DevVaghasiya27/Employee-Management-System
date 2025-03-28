import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';

const LeaveList = () => {
    const [leaves, setLeaves] = useState(null)
    let sno = 1;
    const { id } = useParams()
    const { user } = useAuth()

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.data.success) {
                setLeaves(response.data.leaves);
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    if (!leaves) {
        return <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col justify-center items-center">
                <div className="w-12 h-12 border-4 border-teal-600 border-dashed rounded-full animate-spin"></div>
                <div className="text-teal-600 font-bold text-lg mt-4">Loading...</div>
            </div>
        </div>;
    }

    return (
        <div className='p-6'>
            <div className='text-center'>
                <h2 className="text-3xl font-bold text-teal-600">Manage Leaves</h2>
            </div>
            <div className='flex justify-between items-center pb-2'>
                <input
                    type="text"
                    placeholder='Search By Leave'
                    className="px-4 py-0.5 border" />
                {user.role === "employee" &&
                    <Link
                        to="/employee-dashboard/add-leave"
                        className='px-4 py-1 bg-teal-600 rounded text-white'>Add New Leave</Link>
                }
            </div>

            <table className="w-full text-sm text-left text-gray-700 border border-gray-200">
                {/* Table Head */}
                <thead className="text-xs uppercase bg-teal-600 text-white">
                    <tr>
                        <th className="px-6 py-3">S No</th>
                        <th className="px-6 py-3">Leave Type</th>
                        <th className="px-6 py-3">From</th>
                        <th className="px-6 py-3">To</th>
                        <th className="px-6 py-3">Reason</th>
                        <th className="px-6 py-3">Applied Date</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {leaves.map((leave, index) => (
                        <tr
                            key={leave._id}
                            className={`border-b ${leave.status === "Rejected" ? "bg-red-100" : "bg-gray-50 hover:bg-gray-100"
                                }`}
                        >
                            <td className="px-6 py-3">{index + 1}</td>
                            <td className="px-6 py-3">{leave.leaveType}</td>
                            <td className="px-6 py-3">{new Date(leave.startDate).toLocaleDateString('en-GB')}</td>
                            <td className="px-6 py-3">{new Date(leave.endDate).toLocaleDateString('en-GB')}</td>
                            <td className="px-6 py-3">{leave.reason}</td>
                            <td className="px-6 py-3">{new Date(leave.appliedAt).toLocaleDateString('en-GB')}</td>
                            <td className="px-6 py-3 font-semibold">
                                <span
                                    className={`px-3 py-1 rounded-md text-xs ${leave.status === "Approved"
                                        ? "bg-green-200 text-green-700"
                                        : leave.status === "Rejected"
                                            ? "bg-red-200 text-red-700"
                                            : "bg-yellow-200 text-yellow-700"
                                        }`}
                                >
                                    {leave.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>
    )
}

export default LeaveList;
