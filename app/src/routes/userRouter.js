const express = require('express')
const userRouter = express.Router()
const Controller = require('./../controllers/userController')
const rateLimit = require("express-rate-limit");

const UserController = new Controller()

//middlewares
userRouter.use(rateLimit({
    max: 10
}))
userRouter.use((req, res, next) => {
    if(req.user) {
        res.redirect('/')
    }
    next()
})

//routes
userRouter.post('/', (req, res) => UserController.create(req, res))
userRouter.post('/confirm', (req, res) => UserController.confirmUser(req, res))

userRouter.post('/auth', (req, res) => UserController.auth(req, res))

module.exports = userRouter
