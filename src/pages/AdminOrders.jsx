import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/orders/admin/orders/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch admin orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 mb-4 bg-white shadow-sm"
          >
            <div className="flex justify-between">
              <span className="font-semibold">Order {order.id}</span>
              <span className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 mb-2">
              User: {order.user} | Total: ₹{order.total_amount}
            </p>

            <ul className="border-t mt-2 pt-2">
              {order.items.map((item) => (
                <li key={item.id} className="text-gray-700">
                  {item.product_name} × {item.quantity} — ₹
                  {item.product_price * item.quantity}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminOrders;
