const express = require('express')
const userRouter = express.Router()
const Controller = require('./../controllers/userController')
const rateLimit = require("express-rate-limit")
const isObjectEmpty = require('./../utils/isObjectEmpty')

const UserController = new Controller()

//middlewares
userRouter.use(rateLimit({
    max: 10
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
userRouter.get('/current', (req, res) => UserController.getCurrent(req, res))

module.exports = userRouter
