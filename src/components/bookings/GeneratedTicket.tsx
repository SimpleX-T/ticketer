// import { toPng } from "html-to-image";
// import { useRef } from "react";
// import Barcode from "react-barcode";
// import { BiCalendar } from "react-icons/bi";
// import { GeneratedTicketProps } from "../../types";

// export const GeneratedTicket: React.FC<GeneratedTicketProps> = ({
//   ticketData,
//   onBookAnother,
// }) => {
//   const ticketRef = useRef<HTMLDivElement>(null);

//   const onDownloadTicket = async () => {
//     if (ticketRef.current === null) return;
//     toPng(ticketRef.current, { quality: 1.0, pixelRatio: 3 }).then(
//       (dataUrl) => {
//         const link = document.createElement("a");
//         link.href = dataUrl;
//         link.download = `${ticketData.userName}-${ticketData.ticketId}.png`;
//         link.click();
//       }
//     );
//   };

//   return (
//     <div className="bg-primary-400 border border-secondary-200 rounded-xl p-4">
//       <div className="w-full text-center mb-6">
//         <h3 className="text-white text-xl font-bold mb-2">
//           Your Ticket is Booked!
//         </h3>
//         <p className="text-white text-xs">
//           Check your email for a copy or you can{" "}
//           <button
//             className="font-semibold cursor-pointer text-sm"
//             onClick={onDownloadTicket}
//           >
//             download
//           </button>
//         </p>
//       </div>

//       <div
//         className="p-6 mb-8 w-full ticket max-w-[400px] mx-auto"
//         ref={ticketRef}
//       >
//         <div className="border border-secondary w-full rounded-xl p-4">
//           <div className="mb-6 text-center">
//             <h2 className="text-5xl font-semibold font-[Road_Rage] text-white mb-2">
//               {ticketData.event.name}
//             </h2>
//             <address className="text-white text-xs not-italic">
//               📍 {ticketData.event.location}
//             </address>
//             <p className="text-white text-xs">
//               <BiCalendar className="inline-block mr-2" />{" "}
//               {ticketData.event.date}
//             </p>
//           </div>

//           <div className="gap-6 mb-6 flex items-center justify-center w-48 h-48 rounded-xl overflow-hidden border-[4px] mx-auto border-secondary">
//             {ticketData.profileImage && (
//               <img
//                 src={ticketData.profileImage}
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             )}
//           </div>

//           <div className="bg-secondary-300 rounded-lg p-2 mb-2">
//             <div className="grid grid-cols-2 text-white mb-4">
//               <div className="border border-t-transparent border-l-transparent border-gray-500 py-1 pr-2">
//                 <span className="text-xs py-2 text-gray-500 mb-1">Name</span>
//                 <p className="text-xs">{ticketData.userName}</p>
//               </div>

//               <div className="border-b border-gray-500 py-1 pl-2">
//                 <span className="text-xs py-2 text-gray-500 mb-1">Email</span>
//                 <p className="text-xs truncate">{ticketData.userEmail}</p>
//               </div>

//               <div className="border-r border-b border-gray-500 py-1 pr-2">
//                 <span className="text-xs py-2 text-gray-500">Ticket Type</span>
//                 <p className="text-xs truncate">
//                   {ticketData.ticketType?.type}
//                 </p>
//               </div>

//               <div className="border-b border-gray-500 py-1 pl-2">
//                 <span className="text-xs text-gray-500 py-2">Ticket for</span>
//                 <p className="text-xs truncate">{ticketData.ticketCount}</p>
//               </div>
//             </div>

//             {ticketData.specialRequest && (
//               <div>
//                 <span className="text-xs text-gray-500 py-2">
//                   Special Request
//                 </span>
//                 <p className="text-xs text-white">
//                   {ticketData.specialRequest}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-8 flex items-center justify-center">
//           <Barcode
//             value={ticketData.ticketId as string}
//             height={50}
//             width={1}
//             displayValue={true}
//             background=""
//             lineColor="#ffffff"
//             fontSize={14}
//           />
//         </div>
//       </div>

//       <div className="flex items-center justify-between gap-4">
//         <button
//           onClick={onBookAnother}
//           className="w-1/2 py-2 text-white cursor-pointer border border-secondary rounded-md"
//         >
//           Book Another Ticket
//         </button>

//         <button
//           onClick={onDownloadTicket}
//           className="w-1/2 py-2 bg-secondary cursor-pointer text-white rounded-md transition-colors duration-300 hover:bg-secondary/80"
//         >
//           Download Ticket
//         </button>
//       </div>
//     </div>
//   );
// };
