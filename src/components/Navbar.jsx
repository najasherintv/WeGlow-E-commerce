import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { getCart } from "../utils/cartUtils";
import { getWishlist } from "../utils/wishlistUtils";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("weglowUser")));
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch cart count
  const fetchCartCount = async () => {
    if (!user) return setCartCount(0);
    try {
      const cart = await getCart();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Fetch wishlist count
  const fetchWishlistCount = async () => {
    if (!user) return setWishlistCount(0);
    try {
      const wishlist = await getWishlist();
      setWishlistCount(wishlist.length);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // On mount: fetch counts & set up listeners
  useEffect(() => {
    fetchCartCount();
    fetchWishlistCount();

    const handleWishlistUpdate = () => fetchWishlistCount();
    const handleUserLogin = () => {
      const loggedUser = JSON.parse(localStorage.getItem("weglowUser"));
      setUser(loggedUser);
      fetchCartCount();
      fetchWishlistCount();
    };

    // Listen to wishlist/cart updates globally
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    window.addEventListener("cartUpdated", fetchCartCount);
    window.addEventListener("userLogin", handleUserLogin);

    return () => {
      window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
      window.removeEventListener("cartUpdated", fetchCartCount);
      window.removeEventListener("userLogin", handleUserLogin);
    };
  }, [user]);

  // Logout handler
  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("weglowUser");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setCartCount(0);
    setWishlistCount(0);
    setIsOpen(false);
  };

  // Hide navbar on admin pages
  if (location.pathname.toLowerCase().startsWith("/admin")) return null;

  return (
    <header className="bg-white shadow-sm py-4 border-b fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="text-2xl md:text-3xl font-bold">WeGlow</div>

        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-8 text-base md:text-lg font-medium items-center">
          <Link to="/" className="hover:text-pink-500">Home</Link>
          <a href="#new" className="hover:text-pink-500">Collection</a>
          <Link to="/shop" className="hover:text-pink-500">Shop</Link>
        </nav>

        {/* Desktop icons */}
        <div className="hidden md:flex items-center space-x-6 text-base md:text-lg">
          {user ? (
  <Link to="/my-orders" className="hover:underline">
    Hi, {user.username}
  </Link>
) : (
  <Link to="/login">Login</Link>
)}


          <Link to="/wishlist" className="relative">
            <FaHeart className="text-2xl text-red-500" />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative">
            <FaShoppingCart className="text-2xl" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <>
              <Link to="/register" className="text-gray-700 hover:text-gray-500">Register</Link>
              <Link to="/login" className="text-gray-700 hover:text-gray-500">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700 focus:outline-none text-2xl">
            {isOpen ? "✖" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-4 space-y-4 font-medium text-base">
          <Link to="/" onClick={() => setIsOpen(false)} className="block hover:text-pink-500">Home</Link>
          <a href="#new" onClick={() => setIsOpen(false)} className="block hover:text-pink-500">Collection</a>
          <Link to="/shop" onClick={() => setIsOpen(false)} className="block hover:text-pink-500">Shop</Link>

          <div className="flex items-center space-x-3 mt-2">
            <Link to="/wishlist" className="relative" onClick={() => setIsOpen(false)}>
              <FaHeart className="text-2xl text-red-500" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative" onClick={() => setIsOpen(false)}>
              <FaShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user && <span className="text-gray-700">{user.username}</span>}
          </div>

          {!user ? (
            <>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block">Register</Link>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
