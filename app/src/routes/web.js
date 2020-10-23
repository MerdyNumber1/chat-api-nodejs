const express = require('express')
require('dotenv').config()


// initializing app wia express
const routes = express()

// routes here...
routes.get('/', (req, res) => {
    return res.json({
        'a': 'hi'
    })
})

module.exports = {
    routes
}
