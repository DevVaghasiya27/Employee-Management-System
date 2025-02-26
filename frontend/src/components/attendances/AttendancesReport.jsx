import axios from 'axios'
import React, { useEffect, useState } from 'react'

const AttendancesReport = () => {
  const [report, setReport] = useState({})
  const [limit, setLimit] = useState(5)
  const [skip, setSkip] = useState(0)
  const [dateFilter, setDateFilter] = useState()
  const [loading, setLoading] = useState(false)

  const fetchReport = async () => {
    try {
        setLoading(true);
        const query = new URLSearchParams({ limit, skip });
        if (dateFilter) {
            query.append('date', dateFilter);
        }

        const response = await axios.get(
            `http://localhost:5000/api/attendances/reports?${query.toString()}`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }
        );

        console.log("Fetched Report Data:", response.data); // Debugging

        if (response.data.success) {
            setReport((prevData) => (skip === 0 ? response.data.groupData : { ...prevData, ...response.data.groupData }));
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

  const handleLoadMore = () => {
    setSkip((prevSkip) => prevSkip + limit)
    fetchReport();
  }

  return (
    <div className='min-h-screen p-10 bg-white'>
      <h2 className="text-center text-2xl font-bold">Attendances Reports</h2>
      <div>
        <h2 className='text-xl font-semibold'>Filter by Date</h2>
        <input type="date" className='border bg-gray-100'
        onChange={(e) =>{
          setDateFilter(e.target.value);
          setSkip(0);
        }}/>
      </div>
      {loading ? <div> Loading ...</div> : Object.entries(report).map(([date, record]) => (
        <div className='mt-4 border-b' key={date}>
          <h2 className='text-xl font-semibold'>{date}</h2>
          <table className='' border="1" cellPadding="10">
            <thead className='w-full mt-4'>
              <tr>
                <th>S No</th>
                <th>Employee Id</th>
                <th>Name</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {record.map((data, i) => (
                <tr key={data.employeeId}>
                  <td>{i+1}</td>
                  <td>{data.employeeId}</td>
                  <td>{data.employeeName}</td>
                  <td>{data.departmentName}</td>
                  <td>{data.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
      <button className='px-4 py-2 my-2 boarder bg-gray-100 text-lg font-semibold' onClick={handleLoadMore}>Load More</button>
    </div>
  )

}

export default AttendancesReport