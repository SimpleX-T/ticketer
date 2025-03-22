import { Outlet } from "react-router-dom";

import Sidebar from "../../components/dashboard/Sidebar";

export default function UserDashboard() {
  // return <ClientTickets />;
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen w-full">
      {/* Sidebar Navigation */}
      <div className="w-[250px]">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <main className="bg-primary p-6 w-full border border-primary">
        <Outlet />
      </main>
    </div>
  );
}
