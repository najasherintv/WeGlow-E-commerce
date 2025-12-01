import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { addToWishlist, removeFromWishlist, getWishlist } from "../utils/wishlistUtils";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const fetchWishlistStatus = async () => {
    const wishlist = await getWishlist();
    const exists = wishlist.some((item) => item.product === product.id);
    setIsWishlisted(exists);
  };

  useEffect(() => {
    fetchWishlistStatus();

    const handleWishlistUpdate = () => fetchWishlistStatus();
    window.addEventListener("wishlistUpdated", handleWishlistUpdate);
    return () => window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
  }, [product.id]);

  const handleClick = () => navigate(`/product/${product.id}`);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      const wishlist = await getWishlist();
      const item = wishlist.find((w) => w.product === product.id);
      if (item) await removeFromWishlist(item.id);
    } else {
      await addToWishlist(product.id);
    }

  };

  return (
    <div onClick={handleClick} className="relative bg-white p-4 rounded-xl shadow-md hover:shadow-lg cursor-pointer">
      <div onClick={toggleWishlist} className="absolute top-3 right-3 text-2xl">
        {isWishlisted ? <AiFillHeart className="text-pink-600" /> : <AiOutlineHeart className="text-gray-400" />}
      </div>
      <img src={product.image} alt={product.name} className="w-full h-48 object-contain rounded-lg" />
      <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
      <p className="text-pink-600 font-bold mt-1">₹{product.price}</p>
    </div>
  );
};

export default ProductCard;
