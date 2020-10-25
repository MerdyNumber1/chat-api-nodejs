const express = require('express')
const userRouter = express.Router()
const Controller = require('./../controllers/userController')

const UserController = new Controller()

userRouter.post('/', (req, res) => UserController.create(req, res))

module.exports = userRouter
