import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "S No.",
        selector: (row) => row.sno,
        sortable: true,
        width: "76px",
    },
    {
        name: "Employee ID",
        selector: (row) => row.employeeId,
        sortable: true,
        width: "140px",
    },
    {
        name: "Employee Name",
        selector: (row) => row.name,
        sortable: true,
        width: "140px",
    },
    {
        name: "Department",
        selector: (row) => row.department,
        width: "120px",
    },
    {
        name: "Leave Type",
        selector: (row) => row.leaveType,
        width: "110px",
    },
    {
        name: "Days",
        selector: (row) => row.days,
        width: "70px",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        width: "120px",
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true,
    },
]

export const LeaveButtons = ({ _id}) => {
    const navigate = useNavigate();

    const handleView = (id) => {
        navigate(`/admin-dashboard/leaves/${id}`);
    };

    return(
        <button 
          className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
          onClick={() => handleView(_id)}
        >
            View
        </button>
    )
}