//database
require('./database/database')

//socket
const socket = require('./routes/socket')
socket.listen(process.env.APP_SOCKET_PORT, () => {
    console.log(`Socket server started at http://localhost:${process.env.APP_SOCKET_PORT}`)
})


// routing
const routes = require('./routes/web').routes
require('dotenv').config()

routes.listen(process.env.APP_PORT, () => {
    console.log(`Node.js server started at http://localhost:${process.env.APP_PORT}`)
})
