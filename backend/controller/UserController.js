import fs from "fs"
import User from "../models/User.js"
import TokenVerify from "../middleware/TokenVerify.js"

class UserController {
  async index(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    const response = TokenVerify.verifyToken(token)
    const role = response.role
    const id = response.id
    if (role != "admin") {
      const user = await User.findById(id)
      const users = []
      users.push(user)
      return res.status(200).json(users)
    } else {
      const users = await User.find({ _id: { $ne: id } })
      return res.status(200).json(users)
    }
  }
  async show(req, res) {
    const id = req.params.id
    const user = await User.findById(id)
    return res.status(200).json(user)
  }
  async store(req, res) {
    let image = ""
    if (req.file) {
      image = req.file.filename
    }
    const user = new User({ ...req.body, image })
    await user.save()
    res.status(201).json({ status: true, message: "User created successfully!" })
  }
  async update(req, res) {
    try {
      const id = req.params.id
      const updateData = { ...req.body }

      // Handle image upload if present
      if (req.file) {
        updateData.image = req.file.filename

        // Delete old image if exists
        const oldUser = await User.findById(id)
        if (oldUser.image && oldUser.image !== "") {
          const oldImagePath = `public/users/${oldUser.image}`
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath)
          }
        }
      }

      const user = await User.findByIdAndUpdate(id, updateData, { new: true })
      return res.status(200).json({ status: true, message: "User updated successfully!", user })
    } catch (error) {
      return res.status(500).json({ status: false, message: "Update failed" })
    }
  }
  async destroy(req, res) {
    const id = req.params.id
    const user = await User.findById(id)
    if (user.image != "") {
      const image = user.image
      const imagePath = `public/users/${image}`
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }
    await User.findByIdAndDelete(id)
    return res.status(200).json({ status: true, message: "User deleted successfully!" })
  }

  async getProfile(req, res) {
    const token = req.headers.authorization.split(" ")[1]
    const response = TokenVerify.verifyToken(token)
    const id = response.id
    const user = await User.findById(id)
    return res.status(200).json(user)
  }

  async verifyAdmin(req, res) {
    try {
      const token = req.headers.authorization.split(" ")[1]
      const response = TokenVerify.verifyToken(token)

      if (!response) {
        return res.status(401).json({ isAdmin: false, message: "Invalid token" })
      }

      const userId = response.id
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ isAdmin: false, message: "User not found" })
      }

      return res.status(200).json({
        isAdmin: user.role === "admin",
        message: user.role === "admin" ? "User has admin privileges" : "User does not have admin privileges",
      })
    } catch (error) {
      console.error("Error verifying admin status:", error)
      return res.status(500).json({ isAdmin: false, message: "Server error" })
    }
  }
}
export default UserController
