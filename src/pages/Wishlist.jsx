import React, { useState, useEffect } from "react";
import { getWishlist, removeFromWishlist } from "../utils/wishlistUtils";


const Wishlist = () => {
  const [items, setItems] = useState([]);

  const fetchWishlistItems = async () => {
    const data = await getWishlist();
    setItems(data);
  };

  useEffect(() => {
    fetchWishlistItems();
    const handleUpdate = () => fetchWishlistItems();
    window.addEventListener("wishlistUpdated", handleUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleUpdate);
  }, []);

  const handleRemove = async (id) => {
  await removeFromWishlist(id); 
};


  if (items.length === 0)
    return <p className="p-60 pr-20 text-gray-600">No items in wishlist.</p>;

  return (
    <div className="p-4 mt-20">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-xl p-4 transition hover:shadow-lg cursor-pointer"
          >
            
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={item.product_image}
                alt={item.product_name}
                className="w-full h-full object-cover"
              />
            </div>

           
            <h3 className="mt-3 text-lg font-semibold">
              {item.product_name}
            </h3>

            
            <p className="text-pink-600 font-bold text-lg mt-1">
              ₹{item.product_price}
            </p>

         
            <button
              onClick={() => handleRemove(item.id)}
              className="mt-3 bg-pink-500 hover:bg-pink-600 text-white py-1.5 px-3 rounded-lg w-full transition"
            >
              Remove from Wishlist
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
