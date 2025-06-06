import React, { useEffect, useState } from 'react'
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const AddSalary = () => {
  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
  });

  const [departments, setDepartments] = useState(null);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
    }
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const emps = await getEmployees(e.target.value)
    setEmployees(emps)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary((prevData) => ({ ...prevData, [name]: value }));
  }

  const handleEmployeeChange = async (e) => {
    const employeeId = e.target.value;
    setSalary((prev) => ({ ...prev, employeeId }));

    if (!employeeId) return;

    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/employee/${employeeId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      if (data?.success) {
        setSalary((prev) => ({ ...prev, basicSalary: data.employee?.salary || 0 }));
      }
    } catch (error) {
      console.error("Error fetching salary:", error.response?.data || error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedSalary = {
      employeeId: salary.employeeId,
      basicSalary: Number(salary.basicSalary),
      allowances: Number(salary.allowances),
      deductions: Number(salary.deductions),  // Use correct key
      payDate: salary.payDate,  // Use correct key
    };

    console.log("Submitting Salary Data:", cleanedSalary);  // Debugging log

    try {
      const response = await axios.post(
        `http://localhost:5000/api/salary/add`,
        cleanedSalary,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/employees");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>{departments ? (
      <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md">
        <h2 className="text-3xl font-bold text-teal-600 mb-6">Add Salary</h2>
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* {Department} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Department
              </label>
              <select
                name='department'
                onChange={handleDepartment}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
                ))}
              </select>
            </div>

            {/* {Employee} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Employee
              </label>
              <select
                name='employeeId'
                onChange={handleEmployeeChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
                ))}
              </select>
            </div>

            {/* {Basic Salary} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Basic Salary
              </label>
              <input
                type='number'
                name='basicSalary'
                value={salary.basicSalary} // <-- Ensure state value is used
                onChange={handleChange}
                placeholder='Basic Salary'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              />
            </div>

            {/* {Allowances} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Allowances
              </label>
              <input
                type='number'
                name='allowances'
                onChange={handleChange}
                placeholder='allowances'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
              />
            </div>

            {/* {Deductions} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Deductions
              </label>
              <input
                type='number'
                name='deductions'
                onChange={handleChange}
                placeholder='Deductions'
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
              />
            </div>

            {/* {Pay Date} */}
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Pay Date
              </label>
              <input
                type='date'
                name='payDate'
                onChange={handleChange}
                className='mt-1 w-full p-2 border border-gray-300 rounded-md'
                required
              />
            </div>

          </div>
          <button
            type='submit'
            className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
          >
            Add Salary
          </button>
        </form>
      </div>
    ) : <div>Loading</div>}</>
  );
};

export default AddSalary;
