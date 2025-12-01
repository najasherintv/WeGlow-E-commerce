import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  getCurrentUser,
  isLoggedIn,
} from "../utils/cartUtils";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = getCurrentUser();

  useEffect(() => {
    if (!user || !isLoggedIn()) {
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      setLoading(true);
      const cartData = await getCart();
      setCart(cartData);
      setLoading(false);
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (cartId, change) => {
  // Optimistically update UI
  setCart(prevCart =>
    prevCart.map(item =>
      item.id === cartId
        ? { ...item, quantity: Math.max(1, item.quantity + change) }
        : item
    )
  );

  try {
    await updateCartQuantity(cartId, change); // Update backend
  } catch (error) {
    console.error("Error updating quantity:", error);
    // Optionally: revert UI if API fails
    const cartData = await getCart();
    setCart(cartData);
  }
};


  const handleRemove = async (cartId) => {
    await removeFromCart(cartId);
    const cartData = await getCart();
    setCart(cartData);
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return <p className="text-center mt-10">Loading your cart...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty</p>
      ) : (
        <>
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b py-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  disabled={item.quantity === 1}
                  className={`px-3 py-1 rounded ${
                    item.quantity === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
              </div>

              <p className="font-semibold">
                ₹{(item.price * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-6">
            <h2 className="text-xl font-bold text-right">
              Subtotal: ₹{subtotal.toFixed(2)}
            </h2>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate("/shop")}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
              >
                Continue Shopping
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
