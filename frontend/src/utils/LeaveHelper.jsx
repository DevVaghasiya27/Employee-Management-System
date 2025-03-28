import { useNavigate } from "react-router-dom";

export const columns = [
    {
        name: "S No.",
        selector: (row) => row.sno,
        sortable: true,
        width: "76px",
        cell: (row) => (
            <div className="text-center font-medium text-gray-700">{row.sno}</div>
        ),
    },
    {
        name: "Employee ID",
        selector: (row) => row.employeeId,
        sortable: true,
        width: "140px",
        cell: (row) => (
            <div className="font-medium text-gray-700">{row.employeeId}</div>
        ),
    },
    {
        name: "Employee Name",
        selector: (row) => row.name,
        sortable: true,
        width: "140px",
        cell: (row) => (
            <div className="font-medium text-gray-800">{row.name}</div>
        ),
    },
    {
        name: "Department",
        selector: (row) => row.department,
        width: "120px",
        cell: (row) => (
            <div className="font-medium text-gray-700">{row.department}</div>
        ),
    },
    {
        name: "Leave Type",
        selector: (row) => row.leaveType,
        width: "110px",
        cell: (row) => (
            <div className="text-sm font-semibold text-teal-600">{row.leaveType}</div>
        ),
    },
    {
        name: "Days",
        selector: (row) => row.days,
        width: "70px",
        cell: (row) => (
            <div className="text-center text-gray-700">{row.days}</div>
        ),
    },
    {
        name: "Status",
        selector: (row) => row.status,
        width: "120px",
        cell: (row) => (
            <div
                className={`px-3 py-1 rounded-md text-xs text-center font-semibold ${row.status === "Approved"
                    ? "bg-green-200 text-green-700"
                    : row.status === "Rejected"
                        ? "bg-red-200 text-red-700"
                        : "bg-yellow-200 text-yellow-700"
                    }`}
            >
                {row.status}
            </div>
        ),
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true,
        cell: (row) => (
            <div className="flex justify-center">
                <LeaveButtons _id={row._id} />
            </div>
        ),
    },
];

export const LeaveButtons = ({ _id }) => {
    const navigate = useNavigate();
    const handleView = (_id) => {
        console.log(_id)

        navigate(`/admin-dashboard/leaves/${_id}`);
    };

    return (
        <button
            className="px-4 py-2 text-sm font-medium bg-teal-500 rounded-lg text-white shadow-md hover:bg-teal-600 transition-all"
            onClick={() => handleView(_id)}
        >
            View
        </button>
    );
};
