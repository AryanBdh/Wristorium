import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminRoute from "./Components/AdminRoute";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Shop from "./Components/Shop";
import Cart from "./Components/Cart";
import Register from "./Auth/Register";
import Login from "./Auth/Login";
import UserProfile from "./Components/Profile/UserProfile";
import AdminDashboard from "./Admin/AdminDashboard";
import AddProduct from "./Admin/AddProduct";
import ProductDetail from "./Components/Product/ProductDetail";
import MensCollection from "./Collections/MensCollection";
import WomensCollection from "./Collections/WomensCollection";
import ScrollToTop from "./ScrollToTop";

const RouterComponent = () => {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/collections/men" element={<MensCollection />} />
        <Route path="/collections/women" element={<WomensCollection />} />
      </Routes>
    </div>
  );
};

export default RouterComponent;
