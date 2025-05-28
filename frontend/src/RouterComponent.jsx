import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Components/Home'
import About from './Components/About'
import Contact from './Components/Contact'
import Shop from './Components/Shop'
import Favorites from './Components/Favourites'
import Cart from './Components/Cart'

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
      </Routes>
    </div>
  )
}

export default RouterComponent
