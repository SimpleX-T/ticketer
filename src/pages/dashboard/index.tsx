import { Link, Route, Routes } from "react-router-dom";

import Settings from "../../components/dashboard/Settings";
import Sidebar from "../../components/dashboard/Sidebar";
import { useAuth } from "../../contexts/AuthContext";
// import MyTickets from "../../components/dashboard/Tickets";

export default function UserDashboard() {
  const { user } = useAuth();
  // return <ClientTickets />;
  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-primary">
        <Routes>
          {/* <Route path="/dashboard/tickets" element={<MyTickets />} /> */}
          <Route path="/dashboard/settings" element={<Settings />} />
          <Route
            path="/dashboard"
            element={
              <div className="text-center mt-10">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Welcome, {user?.displayName || user?.firstname}!
                </h2>
                <p className="text-gray-600 mt-2">
                  Manage your tickets and profile easily.
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <Link
                    to="/dashboard/tickets"
                    className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
                  >
                    View My Tickets
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="px-4 py-2 bg-green-500 text-white rounded shadow hover:bg-green-600"
                  >
                    Edit Profile
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
