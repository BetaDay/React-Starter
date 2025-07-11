import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import UserProfile from "./UserProfile";

const Navbar = () => {
  const location = useLocation();
  const [scrolledPast100vh, setScrolledPast100vh] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      setScrolledPast100vh(scrollY >= viewportHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/properties", label: "Vacancy" },
    { path: "/houses", label: "Houses" },
    // { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    { path: "/faqs", label: "FAQs" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolledPast100vh ? "bg-white shadow" : "bg-[#9BDAEF]/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="logo w-20 md:w-30 flex items-center justify-center pt-1">
              <img
                src="/images/logoF.svg"
                alt="Pata House"
                className="w-full h-auto object-contain md:mt-2"
              />
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-gray-700 hover:text-orange-500 transition-colors ${
                  location.pathname === path ? "text-orange-500 font-small text-sm" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger Menu (Mobile) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-orange-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* User Profile (always visible) */}
          <div className="hidden md:flex items-center space-x-4">
            <UserProfile />
          </div>
        </div>

        {/* Mobile Nav Links */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 pb-4 space-y-3">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-2 py-2 text-gray-700 hover:text-orange-500 transition-colors ${
                  location.pathname === path ? "text-orange-500 font-medium" : ""
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="px-2 mt-2">
              <UserProfile />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
