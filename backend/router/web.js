import express from "express";
import RouteMiddleware from "../middleware/RouteMiddleware.js";
import userRoute from "./userRoute.js";
import loginRoute from "./loginRoute.js";
import registerRoute from "./registerRoute.js";

const auth = new RouteMiddleware();


const webRouter = express.Router();
webRouter.get('/', (req, res) => {
    res.send('We are learning express');
});

webRouter.use('/user',auth.check, userRoute);
webRouter.use('/login', loginRoute);
webRouter.use('/register', registerRoute);


export default webRouter;