
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", to: "/features" },
    { name: "How It Works", to: "/how-it-works" },
    { name: "Testimonials", to: "/testimonials" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-indigo-100/70 bg-white/90 backdrop-blur-xl">
      <div className="header-entrance mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="logo-icon flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-black text-white shadow-lg shadow-indigo-200 transition duration-300 group-hover:rotate-[-8deg] group-hover:scale-110">
            T
          </span>

          <span className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Task<span className="text-indigo-600">Manager</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 rounded-full border border-slate-100 bg-slate-50 p-1.5 md:flex">
          {navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.to}
              style={{ "--item-index": index }}
              className="nav-link rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition duration-300 hover:bg-white hover:text-indigo-600 hover:shadow-sm"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 transition hover:text-indigo-600"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="get-started-btn group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl active:translate-y-0"
          >
            <span className="button-shine absolute inset-0" />
            <span className="relative">Get Started</span>
            <span className="relative transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 md:hidden"
        >
          <span className="text-2xl">{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu-wrap grid transition-all duration-300 ease-in-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="flex flex-col gap-1 border-t border-slate-100 bg-white px-5 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm font-medium text-slate-600 transition hover:translate-x-1 hover:bg-indigo-50 hover:text-indigo-600"
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-2 flex gap-3 border-t border-slate-100 pt-4">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
              >
                Log In
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95"
              >
                Get Started →
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
