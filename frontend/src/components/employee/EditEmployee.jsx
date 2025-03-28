import React, { useEffect, useState } from 'react'
import { fetchDepartments } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    maritalStatus: '',
    designation: '',
    salary: 0,
    department: '',
  });
  const [departments, setDepartments] = useState(null);
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments();
  }, []);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          }
        );
        if (response.data.success) {
          const employee = response.data.employee;
          setEmployee((prev) => ({
            ...prev,
            name: employee.userId.name,
            maritalStatus: employee.maritalStatus,
            designation: employee.designation,
            salary: employee.salary,
            department: employee.department._id,
          }))
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error)
        }
      }
    };

    fetchEmployee();
  }, []);
  // ****************************************************************
  const [newImage, setNewImage] = useState(null);

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };
  // ****************************************************************
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", employee.name);
    formData.append("maritalStatus", employee.maritalStatus);
    formData.append("designation", employee.designation);
    formData.append("salary", employee.salary);
    formData.append("department", employee.department);

    if (newImage) {
      formData.append("image", newImage); // Ensure this matches the multer config
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/employee/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>{departments && employee ? (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className='text-2xl font-bold mb-6'>Edit Employee</h2>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* {Name} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleChange}
                pattern="^[a-zA-Z\s]+$"
                placeholder="Insert Name"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                onInvalid={(e) => e.target.setCustomValidity("Name must contain only letters and spaces.")}
                onInput={(e) => e.target.setCustomValidity("")} // Clear the custom message when typing
                required
              />
            </div>
            {/* {Profile image} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>Profile Image</label>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
              />
            </div>

            {/* {Martial Status} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Martial Status
              </label>
              <select
                name='maritalStatus'
                onChange={handleChange}
                value={employee.maritalStatus}
                placeholder='Martial Status'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>
            </div>

            {/* {Designation} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Designation
              </label>
              <input
                type='text'
                name='designation'
                onChange={handleChange}
                value={employee.designation}
                placeholder='Designation'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              />
            </div>

            {/* {Salary} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Salary
              </label>
              <input
                type='number'
                name='salary'
                onChange={handleChange}
                value={employee.salary}
                placeholder='Salary'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              />
            </div>

            {/* {Department} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Department
              </label>
              <select
                name='department'
                onChange={handleChange}
                value={employee.department}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                ))}
              </select>
            </div>

          </div>
          <button
            type='submit'
            className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
          >
            Update Employee
          </button>
        </form>
      </div>
    ) : <div>Loading</div>}</>
  );
};

export default EditEmployee;
