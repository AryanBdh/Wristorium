"use client"

import { useEffect, useState } from "react"
import { Navigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"

const AdminRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("token")
        const userStr = localStorage.getItem("user")

        if (!token || !userStr) {
          setIsChecking(false)
          return
        }

        // Parse user data
        const user = JSON.parse(userStr)

        // Check if user has admin role
        if (user.role === "admin") {
          setIsAdmin(true)
        } else {
          // Optional: Verify with backend to prevent tampering
          const response = await fetch("http://localhost:3000/user/verify-admin", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          const data = await response.json()
          setIsAdmin(data.isAdmin)
        }
      } catch (error) {
        console.error("Error verifying admin status:", error)
        setIsAdmin(false)
      } finally {
        setIsChecking(false)
      }
    }

    checkAdminStatus()
  }, [])

  // Show loading state while checking
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0e17] text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d4af37] mx-auto"></div>
          <p className="mt-4">Verifying access...</p>
        </div>
      </div>
    )
  }

  // If not admin, redirect to home and show error toast
  if (!isAdmin) {
    toast.error("Access denied. Admin privileges required.", {
      id: "admin-access-denied",
      duration: 5000,
    })
    return <Navigate to="/" state={{ from: location }} replace />
  }

  // If admin, render the protected content
  return children
}

export default AdminRoute
