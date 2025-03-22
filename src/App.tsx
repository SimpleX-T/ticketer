import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootLayout from "./components/layout";
import BookingPage from "./pages/BookingPage";
import LandingPage from "./pages/LandingPage";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Login from "./pages/auth/login";
import { AuthProvider } from "./contexts/AuthContext";
import { AppProvider } from "./contexts/AppContext";
import UserDashboard from "./pages/dashboard";
import CreateEvent from "./pages/CreateEvent";
import Signup from "./pages/auth/signup";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Settings from "./components/dashboard/Settings";
import ClientTickets from "./components/dashboard/ClientTickets";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/events/:eventId",
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/my-tickets",
        element: (
          <ProtectedRoute>
            <div>My Tickets</div>
          </ProtectedRoute>
        ),
      },
      {
        path: "/create-event",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <UserDashboard />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <div className="text-center mt-10 z-50">
            <h2 className="text-2xl font-semibold text-gray-700">Welcome,</h2>
            <p className="text-gray-600 mt-2">
              Manage your tickets and profile easily.
            </p>
            {/* <div className="mt-6 flex justify-center gap-4">
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
                        </div> */}
          </div>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute>
            <ClientTickets />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
