import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewEmployee = () => {
    const { id } = useParams();
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/employee/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    }
                );
                if (response.data.success) {
                    setEmployee(response.data.employee);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
        };

        fetchEmployee();
    }, []);

    return (
        <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center" style={{ padding: "45.5px" }}>
            {employee ? (
                <div className="max-w-3xl bg-white p-8 rounded-2xl shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
                        Employee Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Image */}
                        <div className="flex justify-center">
                            <div className="w-72 h-72 rounded-full border-4 border-blue-500 shadow-md overflow-hidden">
                                <img
                                    src={`http://localhost:5000/${employee.userId.profileImage}`}
                                    alt={`${employee.userId.name}'s profile`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Employee Details */}
                        <div className="flex flex-col justify-center space-y-4">
                            <div className="flex items-center space-x-3">
                                <p className="text-lg font-bold text-gray-700">Name:</p>
                                <p className="text-lg text-gray-600">{employee.userId.name}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <p className="text-lg font-bold text-gray-700">Employee ID:</p>
                                <p className="text-lg text-gray-600">{employee.employeeId}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <p className="text-lg font-bold text-gray-700">Date of Birth:</p>
                                <p className="text-lg text-gray-600">
                                    {new Date(employee.dob).toLocaleDateString('en-GB')}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <p className="text-lg font-bold text-gray-700">Gender:</p>
                                <p className="text-lg text-gray-600">{employee.gender}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <p className="text-lg font-bold text-gray-700">Department:</p>
                                <p className="text-lg text-gray-600">{employee.department.dep_name}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <p className="text-lg font-bold text-gray-700">Marital Status:</p>
                                <p className="text-lg text-gray-600">{employee.maritalStatus}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-12 h-12 border-4 border-teal-600 border-dashed rounded-full animate-spin"></div>
                        <div className="text-teal-600 font-bold text-lg mt-4">Loading...</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewEmployee;
