const express = require('express')
const userRouter = express.Router()
const Controller = require('./../controllers/userController')
const rateLimit = require("express-rate-limit")
const isObjectEmpty = require('./../utils/isObjectEmpty')
require('dotenv').config()


const UserController = new Controller()

//middlewares
userRouter.use(rateLimit({
    max: process.env.APP_MAX_AUTH_REQUESTS_PER_MINUTE
}))

function noAuthMiddleware(req, res, next)  {
    if(!isObjectEmpty(req.user)) {
        res.redirect('/')
    }
    next()
}

//routes
userRouter.post('/',  noAuthMiddleware, (req, res) => UserController.create(req, res))
userRouter.post('/confirm', noAuthMiddleware, (req, res) => UserController.confirmUser(req, res))
userRouter.post('/auth', noAuthMiddleware, (req, res) => UserController.auth(req, res))
userRouter.get('/me', (req, res) => UserController.getCurrent(req, res))

module.exports = userRouter
