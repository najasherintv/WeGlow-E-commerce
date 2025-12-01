import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:8000/api/wishlist/";

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};


export const getWishlist = async () => {
  try {
    const res = await axios.get(API_URL, { headers: getAuthHeaders() });
    return res.data;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};


export const addToWishlist = async (productId) => {
  try {
    const res = await axios.post(API_URL, { product: productId }, { headers: getAuthHeaders() });

    toast.success("Added to wishlist ❤️");  

    window.dispatchEvent(new Event("wishlistUpdated"));
    return res.data;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    toast.error("Failed to add");
    return null;
  }
};


export const removeFromWishlist = async (wishlistId) => {
  try {
    await axios.delete(`${API_URL}${wishlistId}/`, { headers: getAuthHeaders() });

    toast.success("Removed from wishlist 💔");  

    window.dispatchEvent(new Event("wishlistUpdated"));
  } catch (error) {
    console.error("Error removing:", error);
    toast.error("Failed to remove");
  }
};


export const isInWishlist = async (productId) => {
  try {
    const wishlist = await getWishlist();
    return wishlist.some((item) => item.product === productId);
  } catch (error) {
    console.error("Error checking wishlist:", error);
    return false;
  }
};
