import Barcode from "react-barcode";
import { FaTimes } from "react-icons/fa";
import { Event, Ticket, TicketType, User } from "../../../types";
import { BiCalendar } from "react-icons/bi";
import { motion } from "motion/react";

type TicketPreviewModalProps = {
  ticketEvent: Event | undefined;
  ticketUser: User | null;
  ticketType: TicketType | undefined;
  ticket: Ticket;
  onclose: (state: boolean) => void;
};

export const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
  ticketEvent,
  ticketUser,
  ticketType,
  ticket,
  onclose,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center lg:justify-start"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-[400px] mx-4 lg:mx-0 lg:ml-[calc(250px+2rem)] lg:translate-x-0"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close button */}
        <motion.button
          onClick={() => onclose(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          whileHover={{ scale: 1.1 }}
        >
          <FaTimes className="text-xl" />
        </motion.button>

        {/* Ticket content */}
        <div className="space-y-6">
          {/* Event header */}
          <div className="text-center">
            <motion.h2
              className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {ticketEvent?.name}
            </motion.h2>
            <div className="space-y-1 text-gray-300">
              <p className="text-sm flex items-center justify-center gap-1">
                <BiCalendar className="inline-block" />
                {ticketEvent?.startDate}
              </p>
              <p className="text-sm">{ticketEvent?.location}</p>
            </div>
          </div>

          {/* Profile image */}
          <motion.div
            className="relative w-32 h-32 rounded-xl overflow-hidden border-4 border-white/20 mx-auto"
            whileHover={{ rotate: 2 }}
          >
            {ticketUser?.profileImage ? (
              <img
                src={ticketUser.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </motion.div>

          {/* User info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Name</p>
              <p className="font-medium">{`${ticketUser?.firstname} ${ticketUser?.lastname}`}</p>
            </div>

            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Email</p>
              <p className="truncate">{ticketUser?.email}</p>
            </div>

            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Ticket Type</p>
              <p>{ticketType?.type}</p>
            </div>

            <div className="space-y-1 p-3 bg-white/5 rounded-lg">
              <p className="text-gray-400">Capacity</p>
              <p>{ticketEvent?.totalCapacity}</p>
            </div>
          </div>

          {/* Special requests */}
          {ticket.specialRequests && (
            <motion.div
              className="p-4 bg-white/5 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-400 mb-1">Special Requests</p>
              <p className="text-sm">{ticket.specialRequests}</p>
            </motion.div>
          )}

          {/* Barcode */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Barcode
              value={ticket.id as string}
              height={40}
              width={1.2}
              background="transparent"
              lineColor="#ffffff"
              fontSize={12}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// import Barcode from "react-barcode";
// import { FaTimes } from "react-icons/fa";
// import { Event, Ticket, TicketType, User } from "../../../types";
// import { BiCalendar } from "react-icons/bi";

// type TicketPreviewModalProps = {
//   ticketEvent: Event | undefined;
//   ticketUser: User | null;
//   ticketType: TicketType | undefined;
//   ticket: Ticket;
//   onclose: (state: boolean) => void;
// };

// const TicketPreviewModal: React.FC<TicketPreviewModalProps> = ({
//   ticketEvent,
//   ticketUser,
//   ticketType,
//   ticket,
//   onclose,
// }) => {
//   return (
//     <div className="w-full flex items-center justify-center h-full relative">
//       <div className="p-6 mb-8 w-full ticket max-w-[400px] mx-auto mt-20">
//         <div className="border border-secondary w-full rounded-xl p-4">
//           <div className="mb-6 text-center">
//             <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
//               {ticketEvent?.name}
//             </h2>
//             <address className="text-white text-xs not-italic">
//               📍 {ticketEvent?.location}
//             </address>
//             <p className="text-white text-xs">
//               <BiCalendar className="inline-block mr-2" />{" "}
//               {ticketEvent?.startDate}
//             </p>
//           </div>

//           <div className="gap-6 mb-6 flex items-center justify-center w-48 h-48 rounded-xl overflow-hidden border-[4px] mx-auto border-secondary">
//             {ticketUser?.profileImage && (
//               <img
//                 src={ticketUser.profileImage}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             )}
//           </div>

//           <div className="bg-secondary-300 rounded-lg p-2 mb-2">
//             <div className="grid grid-cols-2 text-white mb-4">
//               <div className="border border-t-transparent border-l-transparent border-gray-500 py-1 pr-2">
//                 <span className="text-xs py-2 text-gray-500 mb-1">Name</span>
//                 <p className="text-xs">{`${ticketUser?.firstname} ${ticketUser?.lastname}`}</p>
//               </div>

//               <div className="border-b border-gray-500 py-1 pl-2">
//                 <span className="text-xs py-2 text-gray-500 mb-1">Email</span>
//                 <p className="text-xs truncate">{ticketUser?.email}</p>
//               </div>

//               <div className="border-r border-b border-gray-500 py-1 pr-2">
//                 <span className="text-xs py-2 text-gray-500">Ticket Type</span>
//                 <p className="text-xs truncate">{ticketType?.type}</p>
//               </div>

//               <div className="border-b border-gray-500 py-1 pl-2">
//                 <span className="text-xs text-gray-500 py-2">Ticket for</span>
//                 <p className="text-xs truncate">{ticketEvent?.totalCapacity}</p>
//               </div>
//             </div>

//             {ticket.specialRequests && (
//               <div>
//                 <span className="text-xs text-gray-500 py-2">
//                   Special Request
//                 </span>
//                 <p className="text-xs text-white">{ticket.specialRequests}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-8 flex items-center justify-center">
//           <Barcode
//             value={ticket.id as string}
//             height={50}
//             width={1}
//             displayValue={true}
//             background=""
//             lineColor="#ffffff"
//             fontSize={14}
//           />
//         </div>

//         <button
//           onClick={() => onclose(false)}
//           className="flex items-center justify-center absolute top-20 text-white bg-primary right-1/5 p-2 rounded-full cursor-pointer"
//         >
//           <FaTimes />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TicketPreviewModal;
