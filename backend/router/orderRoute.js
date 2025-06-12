import express from "express"
import OrderController from "../controller/OrderController.js"
import RouteMiddleware from "../middleware/RouteMiddleware.js"

const orderRoute = express.Router()
const orderInstance = new OrderController()
const auth = new RouteMiddleware()

// Protected routes
orderRoute.get("/", auth.check, orderInstance.index)
orderRoute.get("/stats", auth.check, orderInstance.getStats)
orderRoute.get("/:id", auth.check, orderInstance.show)
orderRoute.post("/", auth.check, orderInstance.store)
orderRoute.put("/:id", auth.check, orderInstance.update)
orderRoute.get("/user/:userId", auth.check, orderInstance.getUserOrders)

export default orderRoute
