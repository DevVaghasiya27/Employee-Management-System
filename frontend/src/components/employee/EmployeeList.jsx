import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EmployeeButtons } from "../../utils/EmployeeHelper";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployee, setFilteredEmployee] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setEmpLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/employee/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.data.success) {
        let sno = 1;
        const data = response.data.employees.map((emp) => ({
          id: sno,
          _id: emp._id,
          profileImage: (
            <img
              width={30}
              className="border w-9 h-9 rounded-full"
              src={`http://localhost:5000/${emp.userId.profileImage}`}
              alt="Profile"
            />
          ),
          name: emp.userId.name,
          dob: new Date(emp.dob).toLocaleDateString("en-GB"),
          dep_name: emp.department.dep_name,
          action: (
            <EmployeeButtons
              _id={emp._id}
              onEmployeeDelete={handleEmployeeDelete}
            />
          ),
        }));
        setEmployees(data);
        setFilteredEmployee(data);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to fetch employees");
    } finally {
      setEmpLoading(false);
    }
  };

  const handleEmployeeDelete = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
    setFilteredEmployee((prev) => prev.filter((emp) => emp._id !== id));
  };

  const handleFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredData = employees.filter((emp) =>
      emp.name.toLowerCase().includes(searchTerm)
    );
    setFilteredEmployee(filteredData);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const sortData = (key) => {
    let direction = sortConfig.direction === "asc" ? "desc" : "asc";

    // Handle special sorting for S.No (dynamic index)
    if (key === "sno") {
      const sortedData = [...filteredEmployee].sort((a, b) => {
        const indexA = employees.indexOf(a);
        const indexB = employees.indexOf(b);

        if (indexA < indexB) return direction === "asc" ? -1 : 1;
        if (indexA > indexB) return direction === "asc" ? 1 : -1;
        return 0;
      });

      setSortConfig({ key, direction });
      setFilteredEmployee(sortedData);
      return;
    }

    // Standard sorting for other keys
    const sortedData = [...filteredEmployee].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setFilteredEmployee(sortedData);
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredEmployee.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredEmployee.length / rowsPerPage);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-teal-600">Manage Employees</h2>
      </div>

      {/* Search and Add Button */}
      <div className="flex justify-between items-center pb-4">
        <input
          type="text"
          placeholder="Search By Emp Name"
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          onChange={handleFilter}
        />
        <Link
          to="/admin-dashboard/add-employee"
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          Add New Employee
        </Link>
      </div>

      {/* Employee Table */}
      <div className="overflow-x-auto bg-white rounded-md shadow-md">
        {empLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-teal-600 border-dashed rounded-full animate-spin">
            </div>
            <div className="text-teal-600 font-bold text-lg">Loading...</div>
          </div>
        ) : currentRows.length > 0 ? (
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => sortData("sno")}
                >
                  S.No {sortConfig.key === "sno" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 border border-gray-300">Profile</th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => sortData("name")}
                >
                  Name {sortConfig.key === "name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => sortData("dob")}
                >
                  DOB {sortConfig.key === "dob" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th
                  className="px-4 py-2 border border-gray-300 cursor-pointer"
                  onClick={() => sortData("dep_name")}
                >
                  Department {sortConfig.key === "dep_name" ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                </th>
                <th className="px-4 py-2 border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((emp, index) => (
                <tr
                  key={emp._id}
                  className={`text-center ${index % 2 === 0 ? "bg-gray-100" : "bg-white"}`}
                >
                  {/* Calculate dynamic S.No based on the current page */}
                  <td className="px-4 py-2 border border-gray-300">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-center">
                    <div className="inline-block">
                      {emp.profileImage}
                    </div>
                  </td>
                  <td className="px-4 py-2 border border-gray-300">{emp.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{emp.dob}</td>
                  <td className="px-4 py-2 border border-gray-300">{emp.dep_name}</td>
                  <td className="px-4 py-2 border border-gray-300">{emp.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex justify-center items-center h-40 text-gray-600">
            No employees found.
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-teal-600 text-white hover:bg-teal-700"}`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-300" : "bg-teal-600 text-white hover:bg-teal-700"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EmployeeList;
