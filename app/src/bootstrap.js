//database
require('./database/database')

const host = '0.0.0.0'
//socket
const socket = require('./routes/socket')
socket.listen(process.env.APP_SOCKET_PORT, host, () => {
    console.log(`Socket server started at http://${host}:${process.env.APP_SOCKET_PORT}`)
})


// routing
const routes = require('./routes/web').routes
require('dotenv').config()

routes.listen(process.env.APP_PORT, host,() => {
    console.log(`Node.js server started at http://${host}:${process.env.APP_PORT}`)
})
