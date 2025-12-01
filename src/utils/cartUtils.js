
import axios from "axios";


export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("weglowUser"));
};


const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");


const API_URL = "http://localhost:8000/api/cart/";
const axiosInstance = axios.create();

// Add Authorization header automatically
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// Interceptor to handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken();
        const res = await axios.post(
          "http://127.0.0.1:8000/api/accounts/token/refresh/",
          { refresh: refreshToken }
        );
        localStorage.setItem("accessToken", res.data.access);

        originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Refresh token failed", err);
        localStorage.clear(); // logout
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);




export const getCart = async () => {
  const user = getCurrentUser();
  if (!user) return [];

  try {
    const response = await axiosInstance.get(API_URL); 
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

// Add a product to cart
export const addToCart = async (product, quantity = 1) => {
  const user = getCurrentUser();
  if (!user) return false;

  try {
    const existingCart = await getCart();
    const existingItem = existingCart.find((item) => item.product === product.id);

    if (existingItem) {
      
      await updateCartQuantity(existingItem.id, existingItem.quantity + quantity);
    } else {
    
      await axiosInstance.post(API_URL, {
        product: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return false;
  }
};


export const updateCartQuantity = async (cartId, newQuantity) => {
  try {
    if (newQuantity <= 0) {
      await removeFromCart(cartId);
      return;
    }

    await axiosInstance.patch(`${API_URL}${cartId}/`, {
      quantity: newQuantity,
    });
  } catch (error) {
    console.error("Error updating quantity:", error);
  }
};


export const removeFromCart = async (cartId) => {
  try {
    await axiosInstance.delete(`${API_URL}${cartId}/`);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};


export const getItemQuantity = async (productId) => {
  const cart = await getCart();
  const item = cart.find((p) => p.product === productId);
  return item ? item.quantity : 0;
};


export const saveCart = async (cart) => {
  const user = getCurrentUser();
  if (!user) return;

  try {
    const existingCart = await getCart();

   
    for (const item of existingCart) {
      await removeFromCart(item.id);
    }

   
    for (const item of cart) {
      await axiosInstance.post(API_URL, {
        product: item.id || item.product,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      });
    }
  } catch (error) {
    console.error("Error saving cart:", error);
  }
};


export const isLoggedIn = () => !!getCurrentUser();
