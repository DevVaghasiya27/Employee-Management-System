import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const ViewSalary = () => {
    const [salaries, setSalaries] = useState(null);
    const [filteredSalaries, setFilteredSalaries] = useState(null);
    const { id } = useParams();
    const { user } = useAuth();

    const fetchSalaries = async () => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/salary/${id}/${user.role}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.data.success) {
                setSalaries(response.data.salary);
                setFilteredSalaries(response.data.salary);
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.message);
            }
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, []);

    const filterSalaries = (event) => {
        const query = event.target.value.trim(); // Trim to handle extra spaces
        if (!query) {
            setFilteredSalaries(salaries); // Reset to original data if input is empty
            return;
        }

        const filteredRecords = salaries.filter((salary) => {
            const salaryDate = new Date(salary.payDate).toLocaleDateString("en-GB"); // Convert to DD/MM/YYYY format
            return salaryDate.includes(query); // Check if the date matches the query
        });

        setFilteredSalaries(filteredRecords);
    };


    return (
        <div className="min-h-screen bg-teal-50 p-6">
            {filteredSalaries === null ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="flex flex-col justify-center items-center">
                        <div className="w-12 h-12 border-4 border-teal-600 border-dashed rounded-full animate-spin"></div>
                        <div className="text-teal-600 font-bold text-lg mt-4">Loading...</div>
                    </div>
                </div>
            ) : (
                <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl font-bold text-teal-600">Salary History</h2>
                    </div>
                    <div className="flex justify-end mb-4">
                        <input
                            type="text"
                            placeholder="Search by Date"
                            className="border border-teal-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                            onChange={filterSalaries}
                        />
                    </div>

                    {filteredSalaries.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm text-gray-600">
                                <thead className="bg-teal-600 text-white">
                                    <tr className="text-left uppercase tracking-wide">
                                        <th className="py-3 px-4 border-b">SNO</th>
                                        <th className="py-3 px-4 border-b">Employee ID</th>
                                        <th className="py-3 px-4 border-b">Salary</th>
                                        <th className="py-3 px-4 border-b">Allowance</th>
                                        <th className="py-3 px-4 border-b">Deduction</th>
                                        <th className="py-3 px-4 border-b">Total</th>
                                        <th className="py-3 px-4 border-b">Pay Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSalaries.map((salary, index) => (
                                        <tr
                                            key={salary._id || salary.id || salary.employeeId.employeeId}
                                            className={`${index % 2 === 0 ? "bg-white" : "bg-teal-50"
                                                } hover:bg-teal-100`}
                                        >
                                            <td className="py-3 px-4 border-b">{index + 1}</td>
                                            <td className="py-3 px-4 border-b">
                                                {salary.employeeId.employeeId}
                                            </td>
                                            <td className="py-3 px-4 border-b">{salary.basicSalary}</td>
                                            <td className="py-3 px-4 border-b">{salary.allowances}</td>
                                            <td className="py-3 px-4 border-b">{salary.deductions}</td>
                                            <td className="py-3 px-4 border-b">{salary.netSalary}</td>
                                            <td className="py-3 px-4 border-b">
                                                {new Date(salary.payDate).toLocaleDateString("en-GB")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <p className="text-lg text-gray-500">No Records Found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewSalary;
