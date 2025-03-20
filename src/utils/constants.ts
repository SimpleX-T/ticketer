import { FaCalendarAlt } from "react-icons/fa";
import { TicketType } from "../types";

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/gif"];
export const navItems = [
  { path: "/events", label: "Explore Events", icon: FaCalendarAlt },
  { path: "/create-event", label: "Host Event", icon: FaCalendarAlt },
  { path: "/about", label: "About Us", icon: null },
];

export const categoryTags = [
  {
    label: "Music",
    value: "music",
    backgroundColor: "#1E90FF", // Dodger Blue
    textColor: "#FFFFFF", // White
  },
  {
    label: "Sports",
    value: "sports",
    backgroundColor: "#28A745", // Green
    textColor: "#FFFFFF", // White
  },
  {
    label: "Arts",
    value: "arts",
    backgroundColor: "#FF5733", // Vibrant Red-Orange
    textColor: "#FFFFFF", // White
  },
  {
    label: "Birthday",
    value: "birthday",
    backgroundColor: "#FFC107", // Bright Yellow
    textColor: "#000000", // Black
  },
  {
    label: "Others",
    value: "others",
    backgroundColor: "#6F42C1", // Purple
    textColor: "#FFFFFF", // White
  },
];

export const INITIAL_TICKET_TYPE: TicketType = {
  id: "",
  name: "",
  price: 0,
  type: "regular",
  available: 0,
  total: 0,
  description: "",
  benefits: [],
};
