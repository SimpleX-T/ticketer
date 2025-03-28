import { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Event } from "../../../types";
import { AnimatePresence, motion } from "motion/react";
import { FaEllipsisVertical } from "react-icons/fa6";

export default function ClientEventCard({
  event,
  setEditEvent,
  setDeleteEventId,
}: {
  event: Event;
  setEditEvent: (event: Event) => void;
  setDeleteEventId: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Toggle menu visibility
  const toggleMenu = () => setShowMenu((prev) => !prev);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-primary-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-secondary/20 relative">
      {event.image && (
        <img
          src={event.image}
          alt={event.name}
          className="w-full h-32 object-cover rounded-t-lg mb-3"
        />
      )}
      <h3 className="text-3xl font-bold mb-2 font-[Road_Rage] text-white truncate ">
        {event.name}
      </h3>
      <p className="text-sm text-secondary-100">
        {new Date(event.startDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-secondary-100">{event.location}</p>

      {/* Menu Button */}
      <div className="absolute top-3 right-3" ref={menuRef}>
        <button
          onClick={toggleMenu}
          className="p-2 border border-transparent hover:bg-transparent hover:border-secondary-100/50 bg-secondary-200/50 rounded-sm cursor-pointer transition-colors duration-200"
        >
          <FaEllipsisVertical className="text-secondary text-lg" />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-2 w-32 bg-primary-300 border border-secondary/20 rounded-lg shadow-lg overflow-hidden z-10"
            >
              <li>
                <button
                  onClick={() => {
                    setEditEvent(event);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm cursor-pointer text-secondary hover:bg-secondary-200/30 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaEdit size={12} /> Edit
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setDeleteEventId(event.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-sm cursor-pointer text-red-300 hover:bg-red-500/20 transition-colors duration-200 flex items-center gap-2"
                >
                  <FaTrash size={12} /> Delete
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
