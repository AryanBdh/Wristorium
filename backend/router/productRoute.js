import express from "express"
import ProductController from "../controller/ProductController.js"
import UploadMiddleware from "../middleware/UploadMiddleware.js"
import RouteMiddleware from "../middleware/RouteMiddleware.js"

const productRoute = express.Router()
const productInstance = new ProductController()
const uploadInstance = new UploadMiddleware()
const auth = new RouteMiddleware()

// Public routes
productRoute.get("/", productInstance.index)
productRoute.get("/stats", productInstance.getStats)
productRoute.get("/:id", productInstance.show)

// Protected routes
productRoute.post("/", auth.check, uploadInstance.upload("products").array("images", 6), productInstance.store)
productRoute.put("/:id", auth.check, uploadInstance.upload("products").array("images", 6), productInstance.update)
productRoute.delete("/:id", auth.check, productInstance.destroy)
productRoute.delete("/:id/images/:imageIndex", auth.check, productInstance.removeImage)

export default productRoute
