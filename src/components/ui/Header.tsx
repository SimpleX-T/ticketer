import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect, useState } from "react";
import { FaTicketAlt, FaUserCircle } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../../contexts/AuthContext";
import { navItems } from "../../utils/constants";

export default function Header() {
  const { userTickets } = useAppContext();
  const { user } = useAuth();
  const [addEffect, setAddEffect] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setAddEffect(true);
    const timeout = setTimeout(() => {
      setAddEffect(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [userTickets]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="px-4 py-2 flex z-[999] justify-between items-center bg-primary-300/70 border border-secondary-100 fixed top-4 left-1/2 -translate-x-1/2 max-w-6xl mx-auto w-[95%] rounded-md lg:rounded-full backdrop-blur-md shadow-lg">
      <Link to="/" className="w-[80px] md:w-[150px]">
        <img src="/logo.svg" alt="Tesarus" className="h-10 md:h-12" />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 mx-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-full transition-colors duration-300 flex items-center ${
                isActive
                  ? "text-white bg-secondary/30"
                  : "text-secondary hover:text-white hover:bg-primary-100/30"
              }`
            }
          >
            {item.icon && <item.icon className="mr-2 text-sm" />}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center space-x-3">
        {/* Tickets Button */}
        <Link
          to="/dashboard"
          className={`relative border text-secondary p-2 md:px-4 py-2 rounded-full hidden lg:flex items-center ${
            addEffect ? "bg-white/40" : "bg-primary-300"
          } hover:bg-primary-100 transition-colors duration-300`}
        >
          <FaTicketAlt className="mr-2" />
          <span>MY TICKETS</span>
          {userTickets.length > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 text-xs text-white rounded-full flex items-center justify-center bg-secondary">
              {userTickets.length}
            </span>
          )}
        </Link>

        {/* User Profile or Login */}
        {user ? (
          <Link
            to="/dashboard"
            className="p-2 rounded-full bg-secondary/20 text-secondary hover:bg-secondary/30 transition-colors duration-300"
          >
            <FaUserCircle className="text-xl" />
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 rounded-full bg-secondary text-white hover:bg-secondary/80 transition-colors duration-300"
          >
            Login
          </Link>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-secondary rounded-full hover:bg-primary-100/30 transition-colors duration-300"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? (
            <HiX className="text-xl" />
          ) : (
            <HiMenu className="text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-[250px] bg-primary-300 border border-secondary-100 rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <nav className="flex flex-col py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-3 transition-colors duration-300 flex items-center ${
                      isActive
                        ? "text-white bg-secondary/30"
                        : "text-secondary hover:text-white hover:bg-primary-100/30"
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon className="mr-3 text-sm" />}
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
