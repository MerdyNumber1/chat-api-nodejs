const express = require('express')
const userRouter = require('./userRouter')
const errorHandlerMiddleware = require('./../middlewares/errorHandlerMiddleware')
const authMiddleware = require('./../middlewares/authMiddleware')
require('dotenv').config()

// initializing app wia express
const routes = express()
routes.use(express.json())
const apiRouter = express.Router()

//middlewares...
routes.use(authMiddleware)

// routes here...
apiRouter.use('/users', userRouter)


routes.use('/api', apiRouter)
routes.use(errorHandlerMiddleware)

module.exports = {
    routes
}
