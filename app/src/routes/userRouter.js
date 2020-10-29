const express = require('express')
const userRouter = express.Router()
const Controller = require('./../controllers/userController')

const UserController = new Controller()

userRouter.post('/', (req, res) => UserController.create(req, res))
userRouter.post('/confirm', (req, res) => UserController.confirmUser(req, res))
userRouter.post('/auth', (req, res) => UserController.auth(req, res))

module.exports = userRouter
