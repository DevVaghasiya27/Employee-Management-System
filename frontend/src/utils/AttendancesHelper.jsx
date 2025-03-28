import React from 'react'
import axios from 'axios'

export const columns = [
  {
    name: "S No.",
    selector: (row) => row.sno,
    sortable: true,
    width: "86px",
    cell: (row) => (
      <div className="text-center font-medium text-gray-700">{row.sno}</div>
    ),
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "130px",
    cell: (row) => (
      <div className="font-medium text-gray-800 truncate">{row.name}</div>
    ),
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "110px",
    cell: (row) => (
      <div className="font-medium text-gray-700 truncate">{row.dep_name}</div>
    ),
  },
  {
    name: "Action",
    selector: (row) => row.action,
    center: "true",

  },
]

export const AttendancesHelper = ({ status, employeeId, statusChange }) => {
  const markEmployee = async (status, employeeId) => {
    if (!employeeId) {
      alert("Employee record not found. Attendance update not possible.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/attendances/update/${employeeId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
        }
      );

      if (response.data.success) {
        statusChange();
      }
    } catch (error) {
      alert("Error updating attendance.");
    }
  };

  return (
    <div>
      {status == null ? (
        <div className="flex space-x-3">
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600 transition-all"
            onClick={() => markEmployee("Present", employeeId)}>
            Present
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 transition-all"
            onClick={() => markEmployee("Absent", employeeId)}>
            Absent
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded-lg shadow-md hover:bg-gray-600 transition-all"
            onClick={() => markEmployee("Sick", employeeId)}>
            Sick
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg shadow-md hover:bg-yellow-500 transition-all"
            onClick={() => markEmployee("Leave", employeeId)}>
            Leave
          </button>
        </div>
      ) : (
        <div className="bg-gray-100 w-24 text-center py-2 rounded-lg font-semibold text-gray-700 shadow-sm">
          {status}
        </div>
      )}
    </div>
  );
};
