import { FaSignOutAlt, FaUserCog, FaBars, FaTimes } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTicket } from "react-icons/fa6";
import { BiSolidDashboard } from "react-icons/bi";
import { getRandomColorPair } from "../../utils/helpers";
import { Suspense } from "react";

const Sidebar = ({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) => {
  const { user, handleLogout } = useAuth();

  return (
    <>
      {/* Sidebar Toggle Button (Only visible on mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary-100 cursor-pointer p-2 rounded text-white"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div
        className={`bg-primary-200 text-secondary shadow-md h-screen p-4 flex flex-col pt-12 fixed md:relative top-0 left-0 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-[250px] md:w-[250px] min-w-[250px]`}
      >
        {/* Profile Section */}
        <div className="text-center mb-10">
          <div className="rounded-full mx-auto h-20 w-20 border flex items-center justify-center overflow-hidden">
            <Suspense
              fallback={
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
              }
            >
              <img
                src={user?.profileImage || "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </Suspense>
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
            className="p-2 hover:bg-secondary-200 rounded dashboard-nav flex items-center gap-2"
            end
          >
            <BiSolidDashboard />
            <span>Dashboard</span>
          </NavLink>
          {user?.role === "organizer" ||
            (user?.role === "admin" && (
              <NavLink
                to="/dashboard/events"
                className="p-2 hover:bg-secondary-200 rounded dashboard-nav flex items-center gap-2"
                end
              >
                <FaTicket />
                <span>Events</span>
              </NavLink>
            ))}
          <NavLink
            to="/dashboard/tickets"
            className="p-2 hover:bg-secondary-200 rounded dashboard-nav flex items-center gap-2"
            end
          >
            <FaTicket />
            <span>Tickets</span>
          </NavLink>
          <NavLink
            to="/dashboard/settings"
            className="flex items-center gap-2 p-2 hover:bg-secondary-200 rounded dashboard-nav"
            end
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
    </>
  );
};

export default Sidebar;
