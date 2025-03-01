import { Link, NavLink } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { useEffect, useState } from "react";

export default function Header() {
  const { userTickets } = useAppContext();
  const [addEffect, setAddEffect] = useState(false);

  useEffect(() => {
    setAddEffect(true);
    const timeout = setTimeout(() => {
      setAddEffect(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [userTickets]);

  return (
    <header className="px-4 py-2 flex z-[999] justify-between items-center bg-primary-300/40 border border-secondary-100 fixed top-4 left-1/2 -translate-x-1/2 max-w-6xl mx-auto w-full rounded-full backdrop-blur-md">
      <Link to="/" className="w-[80px] md:w-[150px] mr-auto">
        <img src="/logo.svg" alt="logo" />
      </Link>
      <nav className="hidden md:flex mr-auto">
        <NavLink to="/events" className="text-white mx-2">
          Events
        </NavLink>
        <NavLink to="/contact" className="text-white mx-2">
          Contact
        </NavLink>
      </nav>
      <Link
        to="/dashboard"
        replace
        className={`relative border  text-secondary px-3 py-1 rounded-full ${
          addEffect ? "bg-white/40" : "bg-primary-300"
        }`}
      >
        {userTickets.length > 0 && (
          <span className="absolute -top-2 right-0 w-3 h-3 text-xs text-white p-2 rounded-full flex items-center justify-center bg-secondary">
            {userTickets.length}
          </span>
        )}
        MY TICKETS →
      </Link>
    </header>
  );
}
