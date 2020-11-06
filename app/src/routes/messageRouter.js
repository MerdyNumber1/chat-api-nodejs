const express = require('express')
const messageRouter = express.Router()
const rateLimit = require("express-rate-limit")
const Controller = require('./../controllers/messageController')

const MessageController = new Controller()

//middlewares
messageRouter.use(rateLimit({
    max: 120
}))

//routes
messageRouter.get('/', (req, res) => MessageController.getMessages(req, res))

module.exports = messageRouter
