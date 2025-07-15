import express from "express";
import RouteMiddleware from "../middleware/RouteMiddleware.js";
import userRoute from "./userRoute.js";
import loginRoute from "./loginRoute.js";
import registerRoute from "./registerRoute.js";
import productRoute from "./productRoute.js";
import orderRoute from "./orderRoute.js";
import cartRoute from "./cartRoute.js";
import paymentRoute from "./paymentRoute.js";

const auth = new RouteMiddleware();


const webRouter = express.Router();
webRouter.get('/', (req, res) => {
    res.send('We are learning express');
});

webRouter.use('/user',auth.check, userRoute);
webRouter.use('/login', loginRoute);
webRouter.use('/register', registerRoute);
webRouter.use('/products', productRoute);
webRouter.use('/orders', orderRoute);
webRouter.use("/cart", cartRoute)
webRouter.use("/payments", paymentRoute);


export default webRouter;