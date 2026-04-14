import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-black py-4">
      <div className="container mx-auto text-center">
        <span>
          &copy; {new Date().getFullYear()} Your Website. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
