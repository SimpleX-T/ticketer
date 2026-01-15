import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../components/layout";
import BookingPage from "../pages/BookingPage";
import LandingPage from "../pages/LandingPage";
import ProtectedRoute from "../components/ui/ProtectedRoute";
import Login from "../pages/auth/login";
import Settings from "../components/dashboard/settings";
import Home from "../components/dashboard/Home";
import EventsPage from "../pages/EventsPage";
import AboutUs from "../pages/About";
import Tickets from "../pages/dashboard/Tickets";
import Events from "../pages/dashboard/Events";
import SavedEvents from "../pages/dashboard/SavedEvents";
import UserDashboard from "../pages/dashboard";
import CreateEvent from "../pages/CreateEvent";
import Signup from "../pages/auth/signup";
import OAuthCallback from "../pages/auth/OAuthCallback";

export const router = createBrowserRouter([
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
        path: "/auth/callback",
        element: <OAuthCallback />,
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/events/:eventId",
        element: <BookingPage />,
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
      {
        path: "saved",
        element: (
          <ProtectedRoute>
            <SavedEvents />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
