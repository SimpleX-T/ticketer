// import { Link } from "react-router-dom";

// const MyTickets = ({ isLoading, userTickets, handleDeleteTicket }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-semibold text-gray-700 mb-4">My Tickets</h2>
//       {isLoading ? (
//         <p>Loading tickets...</p>
//       ) : userTickets?.length > 0 ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {userTickets.map((ticket) => (
//             <div
//               key={ticket.ticketCode}
//               className="bg-white p-4 rounded shadow-md"
//             >
//               <h3 className="font-bold">{ticket.eventName}</h3>
//               <p>{ticket.date}</p>
//               <button
//                 onClick={() => handleDeleteTicket(ticket.ticketCode)}
//                 className="mt-2 text-red-500 hover:text-red-700"
//               >
//                 Cancel Ticket
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p>
//           No tickets booked yet.{" "}
//           <Link to="/#events" className="underline">
//             Explore events
//           </Link>
//         </p>
//       )}
//     </div>
//   );
// };

// export default MyTickets;
