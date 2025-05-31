import express from "express"
import RegisterController from "../controller/RegisterController.js"

const registerRoute = express.Router()
const registerInstance = new RegisterController()

registerRoute.post("/", registerInstance.register)

export default registerRoute
