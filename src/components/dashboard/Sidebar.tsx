import { FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTicket } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { getRandomColorPair } from "../../utils/helpers";

const Sidebar = () => {
  const { user, handleLogout } = useAuth();
  return (
    <div className="w-full bg-primary-200 text-secondary shadow-md h-screen p-4 flex flex-col pt-12">
      {/* Profile Section */}
      <div className="text-center mb-10">
        <div className="rounded-full mx-auto h-20 w-20 border flex items-center justify-center overflow-hidden">
          {user?.profileImage ? (
            <img
              src={user?.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="flex items-center justify-center w-full h-full"
              style={{ backgroundColor: getRandomColorPair().bgColor }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: getRandomColorPair().textColor }}
              >
                {user?.firstname?.charAt(0).toUpperCase()}
                {user?.lastname?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold mt-2">
          {user?.displayName || user?.firstname}
        </h3>
        <p className="text-sm text-gray-500">{user?.email}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-4">
        <NavLink
          to="/dashboard"
          className="p-2 hover:bg-secondary-200 rounded flex items-center gap-2"
        >
          <BiSolidDashboard />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/dashboard/tickets"
          className="p-2 hover:bg-secondary-200 rounded flex items-center gap-2"
        >
          <FaTicket />
          <span>Tickets</span>
        </NavLink>
        <NavLink
          to="/dashboard/settings"
          className="flex items-center gap-2 p-2 hover:bg-secondary-200 rounded"
        >
          <FaUserCog />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto p-2 text-secondary transition-colors duration-300 hover:text-red-400 hover:bg-secondary-200 cursor-pointer mb-6 rounded flex items-center"
      >
        <FaSignOutAlt className="mr-2" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
