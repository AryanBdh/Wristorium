import express from "express"
import PaymentController from "../controller/PaymentController.js"
import RouteMiddleware from "../middleware/RouteMiddleware.js"

const paymentRoute = express.Router()
const paymentInstance = new PaymentController()
const auth = new RouteMiddleware()

// eSewa payment routes
paymentRoute.post("/esewa/initiate", auth.check, paymentInstance.initiateEsewaPayment)
paymentRoute.post("/esewa/verify", auth.check, paymentInstance.verifyEsewaPayment)

// General payment routes
paymentRoute.get("/status/:orderId", auth.check, paymentInstance.getPaymentStatus)

export default paymentRoute
