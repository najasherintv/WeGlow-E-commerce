import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  
} from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation()
  if (location.pathname.toLowerCase().startsWith("/admin")) return null;
  return (
    <footer className="bg-gray-900 text-white py-8 px-4 mt-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        
       
        <div>
          <h2 className="text-xl font-bold mb-2">WeGlow</h2>
          <p className="text-sm">
            Premium skincare products made with love and natural ingredients.
          </p>
        </div>

        
        <div>
          <h3 className="font-semibold mb-2">Shop</h3>
          <ul className="text-sm space-y-1">
            <li><a href="#" className="hover:underline">All Products</a></li>
            <li><a href="#" className="hover:underline">New Arrivals</a></li>
            
            <li><a href="#" className="hover:underline">Best Sellers</a></li>
          </ul>
        </div>

        
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 text-lg">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="hover:text-yellow-400" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="hover:text-yellow-400" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className="hover:text-yellow-400" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="hover:text-yellow-400" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedinIn className="hover:text-yellow-400" />
            </a>
          </div>
        </div>

        
        
      </div>

      <div className="text-center mt-8 text-sm text-gray-400">
        © {new Date().getFullYear()} GlowCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;