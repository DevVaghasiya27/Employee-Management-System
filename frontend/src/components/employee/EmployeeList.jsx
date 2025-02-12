import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { columns, EmployeeButtons } from '../../utils/EmployeeHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const EmployeeList = () => {
    const [employees, setEmployees] = useState([])
    const [empLoading, setEmpLoading] = useState(false);
    const [filteredEmployee, setFilteredEmployee] = useState([])

    useEffect(() => {
      const fetchEmployees = async () => {
        setEmpLoading(true);
        try {
          const response = await axios.get(
            'http://localhost:5000/api/employee/', 
            {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('token')}` 
            }
            });
          if (response.data.success) {
            let sno = 1;
            const data = await response.data.employees.map((emp) => ({
              _id: emp._id,
              sno: sno++,
              profileImage: <img width={30} /*height={30}*/ className='rounded-full' src={`http://localhost:5000/${emp.userId.profileImage}`}/>,
              name: emp.userId.name,
              dob: new Date(emp.dob).toLocaleDateString(),
              dep_name: emp.department.dep_name,
              action: (<EmployeeButtons _id={emp._id}/>),
            }));
            setEmployees(data);
            setFilteredEmployee(data);
          }
        } catch (error) {
          if (error.response && !error.response.data.success) {
            alert(error.response.data.error);
          }
        } finally {
          setEmpLoading(false);
        }
      };
      fetchEmployees();
    }, []);

    const handleFilter = (e) => {
      const records = employees.filter((emp) => (
        emp.name.toLowerCase().includes(e.target.value.toLowerCase())
      ))
      setFilteredEmployee(records);
    }

  return (
    <div className='p-6'>
      <div className='text-center'>
          <h3 className='text-2xl font-bold'>Manage Employees</h3>
        </div>
        <div className='flex justify-between items-center pb-2'>
          <input 
            type="text" 
            placeholder='Search By Emp Name' 
            className='px-4 py-0.5 border'
            onChange={handleFilter}
          />  
          <Link 
            to="/admin-dashboard/add-employee" 
            className='px-4 py-1 bg-teal-600 rounded text-white pb-2'
          >
            Add New Employee
          </Link>
        </div>
        <div>
          <DataTable columns={columns} data={filteredEmployee} pagination />
        </div>
    </div>
  )
}

export default EmployeeList