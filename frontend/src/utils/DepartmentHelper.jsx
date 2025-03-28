import { useNavigate } from "react-router-dom"
import axios from "axios"
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';


export const columns = [
    {
        name: "S No.",
        selector: (row) => row.sno,
        sortable: true,
    },
    {
        name: "Department Name",
        selector: (row) => row.dep_name,
        sortable: true,
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: "true"
    },
]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
    const navigate = useNavigate()

    const handleDelete = async (id) => {
        const confirm = window.confirm("Do you want to delete this department?")
        if (confirm) {
            try {
                const response = await axios.delete(
                    `http://localhost:5000/api/department/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                if (response.data.success) {
                    onDepartmentDelete(id)
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error)
                }
            }
        }
    }

    return (
        <div className="flex space-x-3">
            {/* Edit Button */}
            <button className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md"
                onClick={() => navigate(`/admin-dashboard/department/${_id}`)}
            >
                <CreateIcon />
            </button>

            {/* Delete Button */}
            <button className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md"
                onClick={() => handleDelete(_id)}
            >
                <DeleteIcon />
            </button>
        </div>

    )
}
