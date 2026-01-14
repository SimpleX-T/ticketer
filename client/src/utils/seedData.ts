// import { collection, doc, setDoc } from 'firebase/firestore';
// import { Event, EventStatus, User, TicketType, Ticket } from '../types';
// import { db } from '../services/firebase';

// const sampleUsers: Partial<User>[] = [
//   {
//     id: 'user1',
//     firstname: 'Alice',
//     lastname: 'Johnson',
//     email: 'alice@example.com',
//     role: 'user'
//   },
//   {
//     id: 'user2',
//     firstname: 'Bob',
//     lastname: 'Smith',
//     email: 'bob@example.com',
//     role: 'organizer'
//   },
//   {
//     id: 'user3',
//     firstname: 'Carol',
//     lastname: 'White',
//     email: 'carol@example.com',
//     role: 'user'
//   }
// ];

// const generateTicketTypes = (): TicketType[] => {
//   return [
//     {
//       id: 'ticket1',
//       name: 'Early Bird',
//       price: 49.99,
//       type: 'early_bird',
//       available: 50,
//       total: 50,
//       description: 'Limited early bird tickets at a special price',
//       benefits: ['Priority Entry', 'Exclusive Merch']
//     },
//     {
//       id: 'ticket2',
//       name: 'Regular',
//       price: 79.99,
//       type: 'regular',
//       available: 100,
//       total: 100,
//       description: 'Standard admission ticket',
//       benefits: ['General Entry']
//     },
//     {
//       id: 'ticket3',
//       name: 'VIP',
//       price: 149.99,
//       type: 'vip',
//       available: 20,
//       total: 20,
//       description: 'VIP experience with exclusive perks',
//       benefits: ['VIP Lounge Access', 'Meet & Greet', 'Premium Seating']
//     }
//   ];
// };

// const generateEvents = (organizerId: string): Event[] => {
//   const now = new Date('2025-03-04T15:16:35+01:00');
//   const futureEvents: Event[] = [
//     {
//       id: 'event1',
//       name: 'Summer Music Festival',
//       sta: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
//       location: 'Central Park, New York',
//       description: 'A day of amazing music featuring top artists',
//       image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
//       ticketTypes: generateTicketTypes(),
//       organizerId,
//       maxTicketsPerUser: 4,
//       category: 'Music',
//       status: EventStatus.PUBLISHED,
//       totalCapacity: 170,
//       ticketsSold: 0,
//       soldOut: false,
//       createdAt: new Date(now).toISOString()
//     },
//     {
//       id: 'event2',
//       name: 'Tech Conference 2025',
//       date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
//       location: 'Convention Center, San Francisco',
//       description: 'The biggest tech conference of the year',
//       image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
//       ticketTypes: generateTicketTypes(),
//       organizerId,
//       maxTicketsPerUser: 2,
//       category: 'Technology',
//       status: EventStatus.PUBLISHED,
//       totalCapacity: 170,
//       ticketsSold: 0,
//       soldOut: false,
//       createdAt: new Date(now).toISOString()
//     },
//     {
//       id: 'event3',
//       name: 'Food & Wine Festival',
//       date: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
//       location: 'Waterfront Park, Seattle',
//       description: 'Taste the finest wines and cuisine from around the world',
//       image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
//       ticketTypes: generateTicketTypes(),
//       organizerId,
//       maxTicketsPerUser: 6,
//       category: 'Food & Drink',
//       status: EventStatus.PUBLISHED,
//       totalCapacity: 170,
//       ticketsSold: 0,
//       soldOut: false,
//       createdAt: new Date(now).toISOString()
//     }
//   ];

//   return futureEvents;
// };

// const generateTickets = (currentUserId: string, events: Event[]): Partial<Ticket>[] => {
//   const tickets: Partial<Ticket>[] = [];
//   const now = new Date('2025-03-04T15:50:19+01:00');

//   // Helper function to generate a random ticket code
//   const generateTicketCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

//   events.forEach(event => {
//     event.ticketTypes.forEach(ticketType => {
//       // Generate tickets for current user (3-4 tickets per event)
//       for (let i = 0; i < Math.floor(Math.random() * 2) + 3; i++) {
//         tickets.push({
//           id: `ticket-${event.id}-${currentUserId}-${i}`,
//           ticketTypeId: ticketType.id,
//           eventId: event.id,
//           userId: currentUserId,
//           purchaseDate: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
//           status: TicketStatus.PURCHASED,
//           price: ticketType.price,
//           ticketCode: generateTicketCode(),
//           isTransferred: false
//         });
//       }

//       // Generate tickets for other users (2-3 tickets per event)
//       sampleUsers.forEach(user => {
//         if (user.id !== currentUserId) {
//           for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
//             tickets.push({
//               id: `ticket-${event.id}-${user.id}-${i}`,
//               ticketTypeId: ticketType.id,
//               eventId: event.id,
//               userId: user.id!,
//               purchaseDate: new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
//               status: TicketStatus.PURCHASED,
//               price: ticketType.price,
//               ticketCode: generateTicketCode(),
//               isTransferred: false
//             });
//           }
//         }
//       });
//     });
//   });

//   return tickets;
// };

// export const seedDatabase = async (currentUserId: string) => {
//   try {
//     // Seed users
//     const usersCollection = collection(db, 'users');
//     const userPromises = sampleUsers.map(user =>
//       setDoc(doc(usersCollection, user.id), {
//         ...user,
//         createdAt: new Date('2025-03-04T15:50:19+01:00').toISOString()
//       })
//     );
//     await Promise.all(userPromises);
//     console.log('Users seeded successfully');

//     // Seed events
//     const events = generateEvents(currentUserId);
//     const eventsCollection = collection(db, 'events');
//     const eventPromises = events.map(event =>
//       setDoc(doc(eventsCollection, event.id), event)
//     );
//     await Promise.all(eventPromises);
//     console.log('Events seeded successfully');

//     // Seed tickets
//     const tickets = generateTickets(currentUserId, events);
//     const ticketsCollection = collection(db, 'tickets');
//     const ticketPromises = tickets.map(ticket =>
//       setDoc(doc(ticketsCollection, ticket.id), ticket)
//     );
//     await Promise.all(ticketPromises);
//     console.log('Tickets seeded successfully');

//     return { success: true };
//   } catch (error) {
//     console.error('Error seeding database:', error);
//     return { success: false, error };
//   }
// };
