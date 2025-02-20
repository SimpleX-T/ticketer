import { Link, NavLink } from "react-router-dom";

export default function Header() {
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
      <button className="bg-primary-300 border  text-secondary px-3 py-1 rounded-full">
        MY TICKETS →
      </button>
    </header>
  );
}
