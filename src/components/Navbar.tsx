import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";
import UserProfile from "./UserProfile";

const Navbar = () => {
  const location = useLocation();
  const [scrolledPast100vh, setScrolledPast100vh] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      setScrolledPast100vh(scrollY >= viewportHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolledPast100vh ? "bg-white shadow" : "bg-[#9BDAEF]/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">

        <div className="logo w-[100px] h-[100px] align-center flex items-center justify-center">
          <img src="/images/logoF.svg" alt="Pata House" />
        </div>

            
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: "/", label: "Home" },
              { path: "/properties", label: "Vacancy" },
              { path: "/houses", label: "Houses" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
              { path: "/faqs", label: "FAQs" },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`text-gray-700 hover:text-orange-500 transition-colors ${
                  location.pathname === path ? "text-orange-500 font-medium" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <UserProfile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
