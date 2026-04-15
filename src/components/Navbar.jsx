import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, removeAuthToken, removeUser } from "../utils/helpers";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-blue-600 text-white p-2 rounded-lg font-bold">
            AM
          </div>
          <span className="text-xl font-bold text-gray-800 hidden md:inline">
            Asset Management
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden md:inline">
            {user?.name}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
            >
              {user?.name?.charAt(0).toUpperCase()}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 last:rounded-b-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
