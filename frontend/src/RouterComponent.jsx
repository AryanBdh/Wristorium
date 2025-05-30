import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Components/Home'
import About from './Components/About'
import Contact from './Components/Contact'
import Shop from './Components/Shop'
import Favorites from './Components/Favourites'
import Cart from './Components/Cart'
import Register from './Auth/Register'
import Login from './Auth/Login'
import UserProfile from './Components/Profile/UserProfile'
import AdminDashboard from './Admin/AdminDashboard'
import AddProduct from './Admin/AddProduct'
import ProductDetail from './Components/Product/ProductDetail'

const RouterComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/contact" element={<Contact/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/favourites" element={<Favorites/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/profile" element={<UserProfile/>} />
        <Route path="/dashboard" element={<AdminDashboard/>} />
        <Route path="/dashboard/add-product" element={<AddProduct/>} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </div>
  )
}

export default RouterComponent
