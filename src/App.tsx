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
import Settings from "./components/dashboard/settings";
import Home from "./components/dashboard/Home";
import EventsPage from "./pages/EventsPage";
import AboutUs from "./pages/About";
import Tickets from "./pages/dashboard/Tickets";
import Events from "./pages/dashboard/Events";

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
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/events/:eventId",
        element: (
 <ProtectedRoute>
<BookingPage />
</ProtectedRoute>),
      },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        ),
      },
      {
        path: "/events",
        element: <EventsPage />,
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
        path: "/dashboard",
        element: <Home />,
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
            <Tickets />
          </ProtectedRoute>
        ),
      },
      {
        path: "events",
        element: (
          <ProtectedRoute>
            <Events />
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
