import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { DepartmentButtons } from "../../utils/DepartmentHelper";
import axios from "axios";

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [depLoading, setDepLoading] = useState(false);
  const [filteredDepartments, setFilteredDepartments] = useState([]);

  const onDepartmentDelete = async (id) => {
    const data = departments.filter((dep) => dep._id !== id);
    setDepartments(data);
    setFilteredDepartments(data);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/department/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            _id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            action: (
              <DepartmentButtons
                _id={dep._id}
                onDepartmentDelete={onDepartmentDelete}
              />
            ),
          }));
          setDepartments(data);
          setFilteredDepartments(data);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const filterDepartments = (e) => {
    const filtered = departments.filter((dep) =>
      dep.dep_name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredDepartments(filtered);
  };

  const columns = [
    { name: "S No.", selector: (row) => row.sno, sortable: true },
    { name: "Department Name", selector: (row) => row.dep_name, sortable: true },
    {
      name: "Action",
      selector: (row) => (
        <DepartmentButtons _id={row._id} onDepartmentDelete={onDepartmentDelete} />
      ),
      center: true,
    },
  ];

  return (
    <>
      {depLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col justify-center items-center">
            <div className="w-12 h-12 border-4 border-teal-600 border-dashed rounded-full animate-spin"></div>
            <div className="text-teal-600 font-bold text-lg mt-4">Loading...</div>
          </div>
        </div>
      ) : (
        <div className='p-5'>
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-teal-600">Manage Departments</h2>
          </div>
          <div className="flex justify-between items-center mb-4">
            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by Department Name"
              className="w-72 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-600 focus:outline-none"
              onChange={filterDepartments}
            />
            {/* Add New Department Button */}
            <Link
              to="/admin-dashboard/add-department"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg shadow-sm"
            >
              Add New Department
            </Link>
          </div>
          {/* Data Table */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <DataTable
              columns={columns}
              data={filteredDepartments}
              pagination
              highlightOnHover
              responsive
              customStyles={{
                header: {
                  style: {
                    backgroundColor: "#D1FAE5", // Light teal
                    color: "#065F46", // Dark teal
                    fontWeight: "bold",
                    fontSize: "16px",
                    textAlign: "left",
                  },
                },
                rows: {
                  style: {
                    fontSize: "14px",
                    color: "#065F46", // Dark teal text for rows
                    "&:nth-of-type(odd)": {
                      backgroundColor: "#F0FDFA", // Light background for odd rows
                    },
                    "&:nth-of-type(even)": {
                      backgroundColor: "#FFFFFF", // White background for even rows
                    },
                    "&:hover": {
                      backgroundColor: "#E6FFFA", // Hover effect with light teal
                      cursor: "pointer",
                    },
                  },
                },
                pagination: {
                  style: {
                    borderTop: "1px solid #E5E7EB", // Light gray border
                    color: "#065F46",
                  },
                  pageButtonsStyle: {
                    color: "#065F46", // Teal for pagination buttons
                    "&:hover": {
                      backgroundColor: "#D1FAE5", // Lighter teal on hover
                    },
                  },
                },
              }}
            />
          </div>

        </div>
      )}
    </>
  );
};

export default DepartmentList;
