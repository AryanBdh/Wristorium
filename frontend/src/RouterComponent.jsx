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
import Checkout from "./Components/Checkout";
import EsewaFailure from "./esewa/EsewaFailure";
import EsewaSuccess from "./esewa/EsewaSuccess";
import EditProduct from "./Admin/EditProduct";
import SmartCollection from "./Collections/SmartCollection";
import AdminOrderEdit from "./Admin/AdminOrderEdit";

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
        <Route path="/checkout" element={<Checkout />} />

        {/* Payment Routes */}
        <Route path="/esewa/success" element={<EsewaSuccess />} />
        <Route path="/esewa/failure" element={<EsewaFailure />} />

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
        <Route
          path="/dashboard/products/:id/edit"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/dashboard/orders/:id/edit"
          element={
            <AdminRoute>
              <AdminOrderEdit />
            </AdminRoute>
          }
        />

        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/collections/men" element={<MensCollection />} />
        <Route path="/collections/women" element={<WomensCollection />} />
        <Route path="/collections/smart" element={<SmartCollection />} />
      </Routes>
    </div>
  );
};

export default RouterComponent;
