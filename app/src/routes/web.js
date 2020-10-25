const express = require('express')
const userRouter = require('./userRouter')
require('dotenv').config()

// initializing app wia express
const routes = express()
routes.use(express.json())
const apiRouter = express.Router()

// routes here...
apiRouter.use('/users', userRouter)


routes.use('/api', apiRouter)

module.exports = {
    routes
}
