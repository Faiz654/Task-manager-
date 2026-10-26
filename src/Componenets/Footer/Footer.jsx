
import { Link } from "react-router-dom";

const Footer = () => {
  const linkClass =
    "text-sm text-[#aaa69e] transition hover:translate-x-1 hover:text-[#c2a878]";

  return (
    <footer className="bg-[#171717] px-6 py-12 text-[#f5f1e8] md:px-12 lg:px-24">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 pb-10 md:grid-cols-4">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Link
            to="/"
            className="mb-3 inline-block text-2xl font-bold transition hover:text-[#c2a878]"
          >
            Task Manager
          </Link>

          <p className="max-w-xs text-sm leading-7 text-[#aaa69e]">
            Plan your day, stay focused, and get more done.
          </p>
        </div>

        {/* Explore */}
        <div className="flex flex-col items-start gap-4">
          <h3 className="mb-1 text-sm font-semibold">Explore</h3>

          <Link to="/features" className={linkClass}>
            Features
          </Link>

          <Link to="/how-it-works" className={linkClass}>
            How It Works
          </Link>

          <Link to="/testimonials" className={linkClass}>
            Testimonials
          </Link>
        </div>

        {/* Account */}
        <div className="flex flex-col items-start gap-4">
          <h3 className="mb-1 text-sm font-semibold">Account</h3>

          <Link to="/login" className={linkClass}>
            Log in
          </Link>

          <Link to="/signup" className={linkClass}>
            Get started
          </Link>
        </div>

        {/* Support */}
        <div className="flex flex-col items-start gap-4">
          <h3 className="mb-1 text-sm font-semibold">Support</h3>

          <Link to="/forgot-password" className={linkClass}>
            Forgot password?
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto max-w-7xl border-t border-[#343434] pt-6">
        <p className="text-xs text-[#85817a]">
          © {new Date().getFullYear()} Task Manager. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
