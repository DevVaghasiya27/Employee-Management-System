import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AttendancesReport = () => {
  const [report, setReport] = useState({})
  const [limit, setLimit] = useState(5)
  const [skip, setSkip] = useState(0)
  const [dateFilter, setDateFilter] = useState()
  const [loading, setLoading] = useState(false)

  // show all employee attendance based on day fetch attendance dynamically
  const fetchReport = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams({ skip });

      if (dateFilter) {
        query.delete("skip"); // Remove skip parameter when filtering by date
        query.append("date", dateFilter);
      }

      const response = await axios.get(
        `http://localhost:5000/api/attendances/reports?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        setReport(
          dateFilter
            ? response.data.groupData // Replace data if filtering by date
            : (prevData) => ({
              ...prevData, // Keep existing data
              ...response.data.groupData, // Add new day's data
            })
        );

        if (response.data.limit) {
          setLimit(response.data.limit);
        }
      }

      setLoading(false);
    } catch (error) {
      alert(error.response?.data?.error || "Error fetching report");
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReport();
  }, [skip, dateFilter])


  // to add whole day attendance dynamically
  const handleLoadMore = () => {
    if (dateFilter) {
      alert("Load More is disabled when filtering by date.");
      return;
    }
    setSkip((prevSkip) => prevSkip + 1); // Move to the next day's data
  };


  return (
    <div className='min-h-screen p-10 bg-white'>
      <h2 className="text-center text-2xl font-bold text-teal-600">Attendances Reports</h2>
      <div>
        <h2 className='text-xl font-semibold text-teal-600'>Filter by Date</h2>
        <input
          type="date"
          className="border bg-gray-100"
          onChange={(e) => {
            setDateFilter(e.target.value);
            setSkip(0);
            setReport({}); // Clear existing report data
          }}
        />
      </div>
      {loading ? <div> Loading ...</div> : Object.entries(report).map(([date, record]) => (
        <div className='mt-4 border-b' key={date}>
          <h2 className='text-xl font-semibold text-teal-700 mb-3'>
            {new Date(date).toLocaleDateString('en-GB').replace(/\//g, '-')}
          </h2>

          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full border border-gray-200">
              <thead className="bg-teal-600 text-white uppercase text-sm">
                <tr>
                  <th className="py-2 px-4 text-left">S No</th>
                  <th className="py-2 px-4 text-left">Employee Id</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Department</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {record.map((data, i) => (
                  <tr
                    key={data.employeeId}
                    className={`border-b text-gray-700 ${!data.employeeId ? 'bg-red-100' : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                  >
                    <td className="py-2 px-4">{i + 1}</td>
                    <td className="py-2 px-4 font-medium">
                      {data.employeeId ? data.employeeId : "Deleted"}
                    </td>
                    <td className="py-2 px-4">{data.employeeName}</td>
                    <td className="py-2 px-4">{data.departmentName}</td>
                    <td className="py-2 px-4">{data.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      ))}
      <button
        className="px-4 py-2 my-2 border bg-gray-100 text-lg font-semibold text-teal-600"
        onClick={handleLoadMore}
        disabled={!!dateFilter} // Disable button when a date filter is applied
      >
        {dateFilter ? "Load More Disabled" : "Load More"}
      </button>
    </div>
  )

}

export default AttendancesReport
