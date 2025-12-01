import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance"

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
  });

  const navigate = useNavigate();

useEffect(() => {
  const fetchStats = async () => {
    try {
      // 1️⃣ Get user and token from localStorage
      const user = JSON.parse(localStorage.getItem("weglowUser"));
      const token = user?.tokens?.access;

      // 2️⃣ Include token in headers when calling backend
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get("http://127.0.0.1:8000/api/accounts/admin/users/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/products/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://127.0.0.1:8000/api/orders/admin/orders/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setStats({
        users: usersRes.data.length,
        products: productsRes.data.length,
        orders: ordersRes.data.length,
      });
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    }
  };

  fetchStats();
}, []);


  const handleCardClick = (type) => {
    if (type === "users") navigate("/admin/users");
    if (type === "products") navigate("/admin/products");
    if (type === "orders") navigate("/admin/orders");
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">👋 Welcome Admin</h1>
      <p className="text-gray-600 mb-4 md:mb-6">
        Here's a quick overview of your store.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        
        <div
          onClick={() => handleCardClick("users")}
          className="cursor-pointer bg-blue-100 p-4 md:p-6 rounded-lg shadow hover:shadow-lg hover:bg-blue-200 transition flex flex-col justify-between"
        >
          <h2 className="text-lg md:text-xl font-semibold">👤 Total Users</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">{stats.users}</p>
          <p className="text-sm text-gray-600 mt-1 md:mt-2">Click to manage users →</p>
        </div>

        
        <div
          onClick={() => handleCardClick("products")}
          className="cursor-pointer bg-green-100 p-4 md:p-6 rounded-lg shadow hover:shadow-lg hover:bg-green-200 transition flex flex-col justify-between"
        >
          <h2 className="text-lg md:text-xl font-semibold">📦 Total Products</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">{stats.products}</p>
          <p className="text-sm text-gray-600 mt-1 md:mt-2">Click to manage products →</p>
        </div>

        
        <div
          onClick={() => handleCardClick("orders")}
          className="cursor-pointer bg-yellow-100 p-4 md:p-6 rounded-lg shadow hover:shadow-lg hover:bg-yellow-200 transition flex flex-col justify-between"
        >
          <h2 className="text-lg md:text-xl font-semibold">🛒 Total Orders</h2>
          <p className="text-2xl md:text-3xl font-bold mt-2">{stats.orders}</p>
          <p className="text-sm text-gray-600 mt-1 md:mt-2">Click to view orders →</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
