import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import {Toaster} from "react-hot-toast"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Collection from "./pages/Collection";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProductManagement from "./admin/AdminProductManagement";
import AdminUserManagement from "./admin/AdminUserManagement";
import AdminOrders from "./pages/AdminOrders";


const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("weglowUser")) || null;
};


const UserRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role === "admin") return <Navigate to="/admin" />;
  return children;
};


const AdminRoute = ({ children }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "admin") return <Navigate to="/login" />;
  return children;
};

function App() {
  const location = useLocation();

  
  const hideNavbarPaths = ["/shop", "/cart","/login","/admin"];
  const shouldShowNavbar = !hideNavbarPaths.includes(
    location.pathname.toLowerCase()
  );
 const user = getCurrentUser();
const isAdmin = user?.role === "admin";


  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavbar && <Navbar />}

      <main className="flex-grow">
        <Toaster position="top-right"/>
        <Routes>
         
          <Route path="/" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <Home/>} />
          <Route path="/shop" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <Shop/>} />
          <Route path="/collection" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <Collection/>} />
          <Route path="/product/:id" element={isAdmin ? <Navigate to='/admin/dashboard'/> : <ProductDetails/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
  path="/wishlist"
  element={
    <UserRoute>
      {isAdmin ? <Navigate to="/admin/dashboard" /> : <Wishlist />}
    </UserRoute>
  }
/>


          
          <Route
            path="/cart"
            element={
              <UserRoute>
               { isAdmin ? <Navigate to='/admin/dashboard'/> : <Cart/>}
              </UserRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <UserRoute>
                {isAdmin ? <Navigate to='/admin/dashboard'/> : <Checkout/>}
              </UserRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <UserRoute>
               {isAdmin ? <Navigate to='/admin/dashboard'/> : <Orders/>}
              </UserRoute>
            }
          />

          
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path="products" element={<AdminProductManagement />} />
            <Route path="users" element={<AdminUserManagement />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </main>

       {shouldShowNavbar && <Footer />}
    </div>
  );
}

export default App;
