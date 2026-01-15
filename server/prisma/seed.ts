import prisma from "../src/config/database";

// Unsplash images for events
const UNSPLASH_IMAGES = {
  music:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
  tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  gaming:
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  sports:
    "https://images.unsplash.com/photo-1461896836934- voices-of-a-marathon?w=800&q=80",
  art: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
  business:
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80",
  workshop:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
  networking:
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  celebration:
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
  wellness:
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  education:
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
};

const events = [
  {
    name: "Lagos Tech Summit 2026",
    description:
      "Join the biggest tech conference in West Africa! Connect with industry leaders, learn about emerging technologies, and network with fellow innovators. Featuring workshops on AI, blockchain, and cloud computing.",
    location: "Landmark Centre, Victoria Island, Lagos",
    image: UNSPLASH_IMAGES.tech,
    category: "Technology",
    totalCapacity: 500,
    ticketTypes: [
      {
        name: "Early Bird",
        price: 15000,
        type: "early_bird",
        total: 100,
        description: "Limited early bird pricing",
      },
      {
        name: "Regular",
        price: 25000,
        type: "regular",
        total: 300,
        description: "Standard admission",
      },
      {
        name: "VIP",
        price: 75000,
        type: "vip",
        total: 100,
        description: "Front row seating, lunch included",
        benefits: ["Priority seating", "Lunch included", "Networking dinner"],
      },
    ],
  },
  {
    name: "Afrobeats Festival",
    description:
      "Experience the best of Afrobeats with live performances from top artists. Dance the night away with amazing music, great food, and unforgettable vibes!",
    location: "Tafawa Balewa Square, Lagos",
    image: UNSPLASH_IMAGES.music,
    category: "Music",
    totalCapacity: 5000,
    ticketTypes: [
      {
        name: "General Admission",
        price: 5000,
        type: "regular",
        total: 4000,
        description: "Standing area access",
      },
      {
        name: "VIP",
        price: 25000,
        type: "vip",
        total: 800,
        description: "VIP lounge access",
        benefits: ["VIP lounge", "Free drinks", "Meet & greet"],
      },
      {
        name: "VVIP Table",
        price: 150000,
        type: "vvip",
        total: 200,
        description: "Reserved table for 6",
        benefits: ["Reserved table", "Bottle service", "Backstage access"],
      },
    ],
  },
  {
    name: "Game Dev Bootcamp",
    description:
      "A 3-day intensive bootcamp on game development. Learn Unity, Unreal Engine, and game design principles from industry experts. Build and ship your first game!",
    location: "Ventures Park, Ikoyi, Lagos",
    image: UNSPLASH_IMAGES.gaming,
    category: "Gaming",
    totalCapacity: 50,
    ticketTypes: [
      {
        name: "Student",
        price: 10000,
        type: "student",
        total: 20,
        description: "For students with valid ID",
      },
      {
        name: "Professional",
        price: 35000,
        type: "regular",
        total: 30,
        description: "Full bootcamp access",
        benefits: ["Course materials", "Certificate", "Discord access"],
      },
    ],
  },
  {
    name: "Lagos Food Festival",
    description:
      "Taste the flavors of Nigeria and beyond! Over 50 food vendors, cooking demonstrations, and celebrity chef appearances. Bring your appetite!",
    location: "Freedom Park, Lagos Island",
    image: UNSPLASH_IMAGES.food,
    category: "Food & Drink",
    totalCapacity: 2000,
    ticketTypes: [
      {
        name: "Free Entry",
        price: 0,
        type: "free",
        total: 1500,
        description: "Festival access (food sold separately)",
      },
      {
        name: "Tasting Pass",
        price: 15000,
        type: "tasting",
        total: 500,
        description: "20 tasting vouchers included",
        benefits: ["20 tasting vouchers", "Recipe book", "Priority entry"],
      },
    ],
  },
  {
    name: "Startup Pitch Night",
    description:
      "Watch 10 promising startups pitch for ₦50M in funding. Network with investors, founders, and industry experts. Could your next investment be here?",
    location: "The Zone Tech Park, Gbagada",
    image: UNSPLASH_IMAGES.business,
    category: "Business",
    totalCapacity: 200,
    ticketTypes: [
      {
        name: "Observer",
        price: 5000,
        type: "observer",
        total: 150,
        description: "Attend and network",
      },
      {
        name: "Investor",
        price: 0,
        type: "investor",
        total: 50,
        description: "For accredited investors",
        benefits: ["Reserved seating", "Startup decks", "Private dinner"],
      },
    ],
  },
  {
    name: "Yoga & Wellness Retreat",
    description:
      "Escape the city for a day of relaxation. Morning yoga, meditation sessions, healthy meals, and spa treatments. Rejuvenate your mind and body.",
    location: "Epe Resort, Lagos",
    image: UNSPLASH_IMAGES.wellness,
    category: "Health & Wellness",
    totalCapacity: 60,
    ticketTypes: [
      {
        name: "Day Pass",
        price: 25000,
        type: "day",
        total: 40,
        description: "Full day access",
        benefits: ["Yoga sessions", "Healthy lunch", "Meditation"],
      },
      {
        name: "Premium",
        price: 50000,
        type: "premium",
        total: 20,
        description: "Includes spa treatment",
        benefits: [
          "Everything in Day Pass",
          "1hr spa treatment",
          "Wellness gift bag",
        ],
      },
    ],
  },
  {
    name: "Art Exhibition: Lagos Stories",
    description:
      "A curated exhibition featuring 30 contemporary Nigerian artists. Explore paintings, sculptures, and digital art that tell the stories of Lagos.",
    location: "Nike Art Gallery, Lekki",
    image: UNSPLASH_IMAGES.art,
    category: "Arts & Culture",
    totalCapacity: 300,
    ticketTypes: [
      {
        name: "General",
        price: 2000,
        type: "regular",
        total: 250,
        description: "Gallery access",
      },
      {
        name: "Guided Tour",
        price: 5000,
        type: "guided",
        total: 50,
        description: "2-hour guided tour",
        benefits: ["Expert guide", "Artist Q&A", "Catalog"],
      },
    ],
  },
  {
    name: "Web3 Workshop: Build on Blockchain",
    description:
      "Hands-on workshop on building decentralized applications. Learn Solidity, smart contracts, and Web3.js. No prior blockchain experience required!",
    location: "CcHub, Yaba, Lagos",
    image: UNSPLASH_IMAGES.workshop,
    category: "Workshops",
    totalCapacity: 40,
    ticketTypes: [
      {
        name: "Workshop",
        price: 20000,
        type: "regular",
        total: 40,
        description: "Full workshop access",
        benefits: ["Laptop required", "Lunch included", "NFT certificate"],
      },
    ],
  },
  {
    name: "Founders Meetup",
    description:
      "Monthly meetup for startup founders. Share experiences, get advice, and build your network. This month's theme: Scaling Your Startup.",
    location: "Fourpoints by Sheraton, VI",
    image: UNSPLASH_IMAGES.networking,
    category: "Networking",
    totalCapacity: 100,
    ticketTypes: [
      {
        name: "Free",
        price: 0,
        type: "free",
        total: 100,
        description: "Drinks and snacks included",
      },
    ],
  },
  {
    name: "New Year Countdown Party",
    description:
      "Ring in 2027 with style! Live DJ, open bar, fireworks, and the best views of Lagos. The party of the year!",
    location: "Sky Lounge, Eko Atlantic",
    image: UNSPLASH_IMAGES.celebration,
    category: "Celebrations",
    totalCapacity: 500,
    ticketTypes: [
      {
        name: "Regular",
        price: 30000,
        type: "regular",
        total: 350,
        description: "Entry + 2 drinks",
      },
      {
        name: "VIP",
        price: 100000,
        type: "vip",
        total: 100,
        description: "Open bar all night",
        benefits: ["Open bar", "VIP section", "Champagne toast"],
      },
      {
        name: "Table",
        price: 500000,
        type: "table",
        total: 50,
        description: "Table for 10",
        benefits: ["Reserved table", "3 bottles", "Private server"],
      },
    ],
  },
  {
    name: "Lagos Marathon 2026",
    description:
      "Join thousands of runners for the annual Lagos City Marathon. Categories: 10km, 21km half marathon, and full 42km marathon. Run for glory!",
    location: "National Stadium, Surulere",
    image:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800&q=80",
    category: "Sports & Fitness",
    totalCapacity: 10000,
    ticketTypes: [
      {
        name: "10km Run",
        price: 5000,
        type: "10km",
        total: 5000,
        description: "10km category",
        benefits: ["Finisher medal", "T-shirt", "Water stations"],
      },
      {
        name: "Half Marathon",
        price: 10000,
        type: "21km",
        total: 3000,
        description: "21km category",
        benefits: ["Finisher medal", "T-shirt", "Energy gels"],
      },
      {
        name: "Full Marathon",
        price: 15000,
        type: "42km",
        total: 2000,
        description: "42km category",
        benefits: ["Finisher medal", "T-shirt", "Full support"],
      },
    ],
  },
  {
    name: "Photography Masterclass",
    description:
      "Learn photography from award-winning professionals. Covers composition, lighting, editing, and building your portfolio. Bring your camera!",
    location: "Terra Kulture, Victoria Island",
    image: UNSPLASH_IMAGES.education,
    category: "Education",
    totalCapacity: 30,
    ticketTypes: [
      {
        name: "Masterclass",
        price: 45000,
        type: "regular",
        total: 30,
        description: "Full day workshop",
        benefits: ["1-on-1 feedback", "Editing software trial", "Certificate"],
      },
    ],
  },
];

async function seed() {
  console.log("🌱 Seeding events...\n");

  // First, get or create a test organizer
  let organizer = await prisma.user.findFirst({
    where: { role: "ORGANIZER" },
  });

  if (!organizer) {
    organizer = await prisma.user.create({
      data: {
        email: "organizer@tesarus.com",
        firstname: "Event",
        lastname: "Organizer",
        role: "ORGANIZER",
        emailVerified: true,
        passwordHash: "$2a$10$dummy.hash.for.seeding.purposes", // This won't be used for login
      },
    });
    console.log("✅ Created test organizer:", organizer.email);
  } else {
    console.log("✅ Using existing organizer:", organizer.email);
  }

  // Create events
  const now = new Date();

  for (let i = 0; i < events.length; i++) {
    const eventData = events[i];

    // Generate dates (spread over next 4 months)
    const daysFromNow = Math.floor(Math.random() * 120) + 7; // 7-127 days from now
    const startDate = new Date(
      now.getTime() + daysFromNow * 24 * 60 * 60 * 1000
    );
    const eventDuration = [3, 6, 8, 24][Math.floor(Math.random() * 4)]; // 3, 6, 8, or 24 hours
    const endDate = new Date(
      startDate.getTime() + eventDuration * 60 * 60 * 1000
    );

    try {
      const event = await prisma.event.create({
        data: {
          name: eventData.name,
          description: eventData.description,
          location: eventData.location,
          image: eventData.image,
          category: eventData.category,
          startDate,
          endDate,
          totalCapacity: eventData.totalCapacity,
          organizerId: organizer.id,
          ticketTypes: {
            create: eventData.ticketTypes.map((tt) => ({
              name: tt.name,
              price: tt.price,
              type: tt.type,
              total: tt.total,
              available: tt.total,
              description: tt.description || "",
              benefits: tt.benefits || [],
            })),
          },
        },
        include: { ticketTypes: true },
      });

      console.log(
        `✅ Created: ${event.name} (${event.ticketTypes.length} ticket types)`
      );
    } catch (error) {
      console.error(`❌ Failed to create ${eventData.name}:`, error);
    }
  }

  console.log("\n🎉 Seeding complete!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
