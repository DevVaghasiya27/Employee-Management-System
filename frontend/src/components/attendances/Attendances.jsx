import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { columns, AttendancesHelper } from "./../../utils/AttendancesHelper";
import DataTable from "react-data-table-component";
import axios from "axios";

const Attendances = () => {
  const [attendance, setAttendance] = useState([]);
  const [attLoading, setAttLoading] = useState(false);
  const [filteredAttendance, setFilteredAttendance] = useState(null);

  const statusChange = async () => {
    fetchAttendance();
  };

  const fetchAttendance = async () => {
    setAttLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/attendances",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        const data = response.data.attendances.map((att, index) => ({
          employeeId: att.employeeId?._id || "Unknown", // Check for null
          sno: index + 1,
          name: att.employeeId?.userId?.name || "Unknown",
          dep_name: att.employeeId?.department?.dep_name || "Unknown",
          action: (
            <AttendancesHelper
              status={att.status}
              employeeId={att.employeeId?._id || null}
              statusChange={statusChange}
            />
          ),
        }));
        setAttendance(data);
        setFilteredAttendance(data);
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error || "Error fetching attendance.");
      }
    } finally {
      setAttLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleFilter = (e) => {
    const searchQuery = e.target.value.toLowerCase();
    const filtered = attendance.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery)
    );
    setFilteredAttendance(filtered);
  };

  if (!filteredAttendance) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-teal-600">Manage Attendances</h2>
      </div>
      <div className="flex justify-between items-center pb-2 mt-4">
        <input
          type="text"
          placeholder="Search By Emp Name"
          className="px-4 py-0.5 border"
          onChange={handleFilter}
        />
        <p className="text-2xl text-teal-600">
          Marks Employees for{" "}
          <span className="font-bold underline">
            {new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}
          </span>
        </p>
        <Link
          to="/admin-dashboard/attendances-report"
          className="px-4 py-1 bg-teal-600 rounded text-white pb-2"
        >
          Attendances Report
        </Link>
      </div>
      <div>
        <DataTable columns={columns} data={filteredAttendance} pagination />
      </div>
    </div>
  );
};

export default Attendances;
