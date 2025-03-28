import React, { useState } from 'react'
import { useAuth } from '../../context/authContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Setting = () => {
  const navigate = useNavigate()
  const { user, setUser } = useAuth(); // Ensure you can update user state
  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target
    setSetting({ ...setting, [name]: value })
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted", setting); // Debugging

    if (!user || !user.role) {
      alert("User information is missing. Please log in again.");
      return;
    }

    if (setting.oldPassword === setting.newPassword) {
      alert("Old password and new password cannot be the same.");
      return;
    }

    if (setting.newPassword !== setting.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:5000/api/setting/change-password",
        setting,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      console.log("Response:", response.data); // Debugging

      if (response.data.success) {
        alert("Password changed successfully!"); // ✅ Alert on success
        navigate(user.role === "admin" ? "/admin-dashboard" : "/employee-dashboard");
      }
    } catch (error) {
      console.error("API Error:", error); // Log errors
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error); // ✅ Show API error in alert
      }
    }
  };

  return (
    <div className='max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96'>
      <h2 className='text-2xl font-bold mb-6'>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor='oldPassword'
            className='text-sm font-medium text-gray-700'
          >
            Old Password:
          </label>
          <input
            type="password"
            name='oldPassword'
            onChange={handleChange}
            placeholder="Enter Old Password"
            className='mt-1 w-full p-2 border border-gray-300 rounded-md'
            required
          />
        </div>
        <div>
          <label
            htmlFor='newPassword'
            className='text-sm font-medium text-gray-700'
          >
            New Password:
          </label>
          <input
            type="password"
            name='newPassword'
            onChange={handleChange}
            placeholder="Enter New Password"
            className='mt-1 w-full p-2 border border-gray-300 rounded-md'
            required
          />
        </div>
        <div>
          <label
            htmlFor='confirmPassword'
            className='text-sm font-medium text-gray-700'
          >
            Confirm Password:
          </label>
          <input
            type="password"
            name='confirmPassword'
            onChange={handleChange}
            placeholder="Confirm Password"
            className='mt-1 w-full p-2 border border-gray-300 rounded-md'
            required
          />
        </div>
        <button
          type="submit"
          className='w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
        >
          Change Password
        </button>
      </form>
    </div>
  )
}

export default Setting
