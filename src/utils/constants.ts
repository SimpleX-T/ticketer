import { FaCalendarAlt } from "react-icons/fa";
import { Event } from "../types";

export const mockEvents: Event[] = [];

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const navItems = [
  { path: "/events", label: "Explore Events", icon: FaCalendarAlt },
  { path: "/create-event", label: "Host Event", icon: FaCalendarAlt },
  { path: "/about", label: "About Us", icon: null },
];
