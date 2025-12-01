import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCart, getCurrentUser, isLoggedIn } from "../utils/cartUtils";


// ---------------------------------------------
// Load Razorpay script
// ---------------------------------------------
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


// ---------------------------------------------
// Checkout Component
// ---------------------------------------------
const Checkout = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);


  // ---------------------------------------------
  // Fetch user & cart
  // ---------------------------------------------
  useEffect(() => {
    const u = getCurrentUser();

    if (!u || !isLoggedIn()) {
      navigate("/login");
      return;
    }

    setUser(u);

    const fetchCart = async () => {
      try {
        const data = await getCart();
        setCart(data);
      } catch (error) {
        console.log("Cart loading error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);


  // Total amount
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );


  // ---------------------------------------------
  // Razorpay Payment Handler
  // ---------------------------------------------
  const handlePayment = async () => {
    setPaying(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment gateway!");
        setPaying(false);
        return;
      }

      // Create order in backend
      const res = await axios.post(
        "http://127.0.0.1:8000/api/orders/create/",
        { amount: totalAmount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const order = res.data.razorpay_order || res.data.order;

      if (!order) {
        console.error("Invalid backend response:", res.data);
        alert("Unable to create payment order.");
        setPaying(false);
        return;
      }

      // Razorpay checkout options
      const options = {
        key: "rzp_test_RjX6sF4bFmuDLZ", // TEST KEY
        amount: order.amount,
        currency: "INR",
        name: "WeGlow Skincare",
        description: "Purchase Payment",
        order_id: order.id,

        // On success
        handler: async function (response) {
          try {
            await axios.post(
              "http://127.0.0.1:8000/api/orders/verify/",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "accessToken"
                  )}`,
                },
              }
            );

            alert("Payment Successful!");
            navigate("/my-orders");
          } catch (err) {
            console.error("Verification error:", err);
            alert("Payment verification failed.");
          } finally {
            setPaying(false);
          }
        },

        prefill: {
          name: user.username,
          email: user.email,
        },

        theme: {
          color: "#4A3AFF", // soft lavender/beauty brand color
        },

        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Check console for details.");
      setPaying(false);
    }
  };


  // ---------------------------------------------
  // UI Rendering
  // ---------------------------------------------
  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  if (cart.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        Your cart is empty. Add products to continue.
      </p>
    );


return (
  <div className="max-w-5xl mx-auto py-10 px-4 md:px-0">
    <h1 className="text-3xl font-semibold mb-8 tracking-wide text-gray-900">
      Checkout
    </h1>

    <div className="grid md:grid-cols-3 gap-8">

      {/* LEFT SIDE — Delivery + Cart */}
      <div className="md:col-span-2 space-y-6">

        {/* Delivery Box */}
        <div className="border rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Delivery Details
          </h2>
          <div className="space-y-1 text-gray-600">
            <p><span className="font-medium">Name:</span> {user?.username}</p>
            <p><span className="font-medium">Email:</span> {user?.email}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border rounded-2xl p-6 shadow-sm bg-white hover:shadow-md transition">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-5 pt-4 border-t">
            <p className="text-lg font-semibold text-gray-800">Total:</p>
            <p className="text-xl font-bold text-gray-900">
              ₹{totalAmount}
            </p>
          </div>
        </div>

      </div>

      {/* RIGHT SIDE — Payment Section */}
      <div className="space-y-6">
        <div className="border rounded-2xl p-6 shadow-md bg-gray-50">

          <h2 className="text-lg font-semibold mb-4 text-gray-900">
            Payment
          </h2>

          <p className="text-sm text-gray-600 mb-4">
            Pay securely using Razorpay
          </p>

          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full bg-black text-white py-3 rounded-xl 
              text-lg tracking-wide hover:bg-gray-800 transition 
              disabled:bg-gray-400"
          >
            {paying ? "Processing..." : `Pay Now • ₹${totalAmount}`}
          </button>

          <p className="text-xs text-gray-500 text-center mt-3">
            100% Secure Payment • Encrypted Checkout
          </p>
        </div>
      </div>

    </div>
  </div>
);

};

export default Checkout;
