import { FaCalendarAlt } from "react-icons/fa";
import { Event } from "../types";

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

export const mockEvents: Event[] = [
  {
    id: "event1",
    name: "Summer Music Festival",
    description: "A vibrant celebration of music under the sun",
    date: "2023-07-15T14:00:00Z",
    location: "Central Park, New York",
    organizerId: "org1",
    image: "https://example.com/summer-fest.jpg",
    category: "music",
    ticketTypes: [
      {
        id: "ticket1",
        name: "General Admission",
        price: 50,
        available: 1000,
        total: 1000,
        type: "regular",
        description: "Standard entry ticket",
      },
      {
        id: "ticket2",
        name: "VIP Pass",
        price: 150,
        available: 100,
        total: 100,
        type: "vip",
        description: "VIP access with exclusive perks",
      },
    ],
    createdAt: "2023-05-01T10:00:00Z",
    ticketsSold: 0,
    soldOut: false,
    totalCapacity: 1100,
    maxTicketsPerUser: 4,
  },
  {
    id: "event2",
    name: "Tech Conference 2023",
    description: "Exploring the future of technology",
    date: "2023-09-10T09:00:00Z",
    location: "Convention Center, San Francisco",
    organizerId: "org2",
    image: "https://example.com/tech-conf.jpg",
    category: "others",
    ticketTypes: [
      {
        id: "ticket3",
        name: "Early Bird",
        price: 200,
        available: 500,
        total: 500,
        type: "regular",
        description: "Discounted early registration",
      },
      {
        id: "ticket4",
        name: "Standard",
        price: 250,
        available: 1000,
        total: 1000,
        type: "regular",
        description: "Regular conference pass",
      },
    ],
    createdAt: "2023-06-15T14:30:00Z",
    ticketsSold: 0,
    soldOut: false,
    totalCapacity: 1500,
    maxTicketsPerUser: 2,
  },
];
