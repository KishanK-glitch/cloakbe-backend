import React from "react";
// Import the image directly from your assets folder
import logo from "@/assets/safeclock.png";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 bg-background border-b border-border shadow-sm flex items-center justify-center sm:justify-start">
      {/* The Logo Image */}
      <img
        src={logo}
        alt="Cloakbe"
        className="h-8 sm:h-10 object-contain"
      />
    </header>
  );
};

export default Header;