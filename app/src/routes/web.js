const express = require('express')
const userRouter = require('./userRouter')
const messageRouter = require('./messageRouter')
const errorHandlerMiddleware = require('./../middlewares/errorHandlerMiddleware')
const {authMiddleware} = require('./../middlewares/authMiddleware')
const cors = require('cors')
require('dotenv').config()

// initializing app with express
const routes = express()
routes.use(express.json())
const apiRouter = express.Router()

//middlewares...
routes.use(cors())
routes.use(authMiddleware)

// routes here...
apiRouter.use('/users', userRouter)
apiRouter.use('/messages', messageRouter)


routes.use('/api', apiRouter)
routes.use(errorHandlerMiddleware)

module.exports = {
    routes
}
