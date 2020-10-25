const express = require('express')
const routes = express()


routes.use((req, res, next) => {
    if(req.headers.authorization) {

    }
    next()
})
