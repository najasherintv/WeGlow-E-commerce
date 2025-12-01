import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await axios.get("http://127.0.0.1:8000/api/orders/my-orders/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return <p className="text-center mt-10 text-gray-600">Loading orders...</p>;

  if (orders.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">
        You have no past orders.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-20">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="mb-8 border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
        >
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-800 font-semibold text-lg">
              Order #{order.id}
            </span>
            <span className="text-sm text-gray-500">
              {new Date(order.created_at).toLocaleString()}
            </span>
          </div>

         
          <p
            className={`inline-block px-4 py-1 text-sm rounded-full mb-4 ${
              order.status === "paid"
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status.toUpperCase()}
          </p>

         
          <ul className="divide-y divide-gray-200 mb-4">
            {order.items.map((item) => (
              <li key={item.id} className="py-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-14 h-14 object-cover rounded-lg border"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{item.product_name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>

                <p className="font-semibold text-gray-900">
                  ₹{item.product_price * item.quantity}
                </p>
              </li>
            ))}
          </ul>

         
          <div className="flex justify-between pt-4 border-t font-bold text-lg text-gray-900">
            <span>Total:</span>
            <span>₹{order.total_amount}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
