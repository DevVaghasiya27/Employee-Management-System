import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave } from "react-icons/fa";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import CreateIcon from "@mui/icons-material/Create";
import DeleteIcon from "@mui/icons-material/Delete";
import Leave from "../exit.png";

// Fetch all departments
export const fetchDepartments = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/department/", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.data.success) {
      return response.data.departments;
    }
  } catch (error) {
    console.error("Failed to fetch departments", error);
    alert(error.response?.data?.error || "Error fetching departments");
  }
  return [];
};

// Fetch employees by department
export const getEmployees = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/employee/department/${id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.data.success) {
      return response.data.employees;
    }
  } catch (error) {
    console.error("Failed to fetch employees", error);
    alert(error.response?.data?.error || "Error fetching employees");
  }
  return [];
};

// Employee action buttons component
export const EmployeeButtons = ({ _id, onEmployeeDelete }) => {
  const navigate = useNavigate();

  // Handle employee deletion
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const response = await axios.delete(
          `http://localhost:5000/api/employee/${_id}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response.data.success) {
          alert("Employee deleted successfully");
          onEmployeeDelete(_id); // Remove employee from state
        }
      } catch (error) {
        console.error("Failed to delete employee", error);
        alert("Failed to delete employee");
      }
    }
  };

  return (
    <div className="flex space-x-3">
      {/* View Button */}
      <button
        className="px-4 py-1.5 bg-teal-500 hover:bg-teal-600 text-white rounded-md"
        onClick={() => navigate(`/admin-dashboard/employee/${_id}`)}
      >
        <RemoveRedEyeIcon />
      </button>

      {/* Edit Button */}
      <button
        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        onClick={() => navigate(`/admin-dashboard/employee/edit/${_id}`)}
      >
        <CreateIcon />
      </button>

      {/* Salary Button */}
      <button
        className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black rounded-md"
        onClick={() => navigate(`/admin-dashboard/employee/salary/${_id}`)}
      >
        <FaMoneyBillWave className="w-6" />
      </button>

      {/* Leave Button */}
      <button
        className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
        onClick={() => navigate(`/admin-dashboard/employee/leave/${_id}`)}
      >
        <img className="w-6" src={Leave} alt="Leave" />
      </button>

      {/* Delete Button */}
      <button
        className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
        onClick={handleDelete}
      >
        <DeleteIcon />
      </button>
    </div>
  );
};
