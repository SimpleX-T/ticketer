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
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <UserDashboard />
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
