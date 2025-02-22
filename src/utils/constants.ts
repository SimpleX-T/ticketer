import { Event, User } from "../types";
import { generateRandomId } from "./helpers";

export const mockEvents: Event[] = [
  {
    id: generateRandomId(),
    name: "Summer Music Festival",
    date: "2024-07-15",
    location: "Central Park, New York",
    description:
      "Annual summer music festival featuring top artists from around the world.",
    image:
      "https://i.pinimg.com/736x/b3/dc/9c/b3dc9c80a7f08f69383415a79317ac4b.jpg",
    prices: {
      REGULAR: "50",
      VIP: "150",
      VVIP: "300",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Tech Conference 2024",
    date: "2024-08-20",
    location: "Convention Center, San Francisco",
    description:
      "The biggest tech conference of the year, featuring keynote speakers and workshops.",
    image:
      "https://i.pinimg.com/736x/cd/cf/09/cdcf0988ae7baec4e52d6214a5198d4b.jpg",
    prices: {
      REGULAR: "100",
      VIP: "250",
      VVIP: "500",
    },
    soldOut: true,
  },
  {
    id: generateRandomId(),
    name: "Food & Wine Expo",
    date: "2024-09-10",
    location: "Metro Toronto Convention Centre",
    description:
      "A culinary extravaganza showcasing the best food and wine from around the globe.",
    image:
      "https://i.pinimg.com/736x/cd/cf/09/cdcf0988ae7baec4e52d6214a5198d4b.jpg",
    prices: {
      REGULAR: "40",
      VIP: "120",
      VVIP: "250",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Comic Con 2025",
    date: "2025-10-03",
    location: "San Diego Convention Center",
    description:
      "The ultimate pop culture event featuring celebrities, panels, and exclusive merchandise.",
    image:
      "https://i.pinimg.com/736x/36/73/d4/3673d463776873e57195d2dfbac48d58.jpg",
    prices: {
      REGULAR: "75",
      VIP: "200",
      VVIP: "400",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Winter Wonderland",
    date: "2024-12-20",
    location: "Hyde Park, London",
    description:
      "A magical winter festival with ice skating, festive markets, and live entertainment.",
    image:
      "https://i.pinimg.com/736x/5b/25/3b/5b253bc89176bc94f14a02af61182176.jpg",
    prices: {
      REGULAR: "30",
      VIP: "80",
      VVIP: "150",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "E-Sports Championship",
    date: "2024-11-15",
    location: "Staples Center, Los Angeles",
    description:
      "Watch the world's best gamers compete in this high-stakes e-sports tournament.",
    image:
      "https://i.pinimg.com/736x/1d/dc/ad/1ddcad35dd9f6df59114e9d9832dbd0c.jpg",
    prices: {
      REGULAR: "60",
      VIP: "180",
      VVIP: "350",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Jazz Nights",
    date: "2024-06-25",
    location: "Blue Note, Tokyo",
    description:
      "An intimate evening of smooth jazz performances by legendary artists.",
    image: "https://source.unsplash.com/random/800x600/?jazz,music",
    prices: {
      REGULAR: "70",
      VIP: "200",
      VVIP: "400",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Marathon 2024",
    date: "2024-04-14",
    location: "Boston, Massachusetts",
    description:
      "Join thousands of runners in one of the world's most prestigious marathons.",
    image: "https://source.unsplash.com/random/800x600/?marathon,running",
    prices: {
      REGULAR: "20",
      VIP: "50",
      VVIP: "100",
    },
    soldOut: true,
  },
  {
    id: generateRandomId(),
    name: "Art Basel",
    date: "2024-12-05",
    location: "Miami Beach, Florida",
    description:
      "A premier art fair showcasing contemporary works from leading galleries.",
    image:
      "https://i.pinimg.com/736x/0a/6d/95/0a6d95b2fd58623e878b10a656424079.jpg",
    prices: {
      REGULAR: "80",
      VIP: "250",
      VVIP: "500",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Film Festival",
    date: "2024-05-22",
    location: "Cannes, France",
    description:
      "Celebrate the art of cinema with screenings, red carpets, and celebrity appearances.",
    image:
      "https://i.pinimg.com/736x/81/87/7a/81877a9702109d20755036ae1d4fc48d.jpg",
    prices: {
      REGULAR: "100",
      VIP: "300",
      VVIP: "600",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Startup Summit",
    date: "2024-09-30",
    location: "Austin, Texas",
    description:
      "A gathering of innovators, entrepreneurs, and investors shaping the future of tech.",
    image:
      "https://i.pinimg.com/736x/17/63/cb/1763cb885cfdcc8bdf19014ad375457c.jpg",
    prices: {
      REGULAR: "90",
      VIP: "220",
      VVIP: "450",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Fashion Week",
    date: "2024-03-15",
    location: "Paris, France",
    description:
      "Experience the latest trends and collections from top fashion designers.",
    image: "https://source.unsplash.com/random/800x600/?fashion,runway",
    prices: {
      REGULAR: "150",
      VIP: "400",
      VVIP: "800",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Beer Festival",
    date: "2024-08-10",
    location: "Munich, Germany",
    description:
      "Celebrate the finest beers from around the world with live music and food stalls.",
    image: "https://source.unsplash.com/random/800x600/?beer,festival",
    prices: {
      REGULAR: "25",
      VIP: "60",
      VVIP: "120",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Space Exploration Expo",
    date: "2024-07-30",
    location: "Kennedy Space Center, Florida",
    description:
      "Discover the future of space travel with interactive exhibits and expert talks.",
    image: "https://source.unsplash.com/random/800x600/?space,rocket",
    prices: {
      REGULAR: "50",
      VIP: "120",
      VVIP: "250",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Yoga Retreat",
    date: "2024-06-10",
    location: "Bali, Indonesia",
    description:
      "Rejuvenate your mind and body with a week-long yoga retreat in paradise.",
    image: "https://source.unsplash.com/random/800x600/?yoga,retreat",
    prices: {
      REGULAR: "200",
      VIP: "500",
      VVIP: "1000",
    },
    soldOut: false,
  },
];

export const mockUsers: User[] = [
  {
    id: generateRandomId(),
    firstname: "Mark",
    lastname: "Ndubuisi",
    email: "geekbuddy33@gmail.com",
  },
];
