import React from 'react'
import { useAuth } from '../../context/authContext'
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <div className="h-20 bg-teal-600 flex items-center justify-between px-5 text-white">
      <p className="text-xl">Welcome {user.name}</p>
      <button className="px-4 py-1 bg-teal-700 hover:bg-teal-800" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;
