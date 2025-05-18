import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Home from './Home'

const RouterComponent = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home/>} />
      </Routes>
    </div>
  )
}

export default RouterComponent
