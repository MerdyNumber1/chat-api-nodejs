const server = require('http').createServer()
const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')
const User = require('./../models/user')

const clients = []

io.on('connection', socket => {

    if(socket.request.headers.authorization) {
        jwt.verify(
            socket.request.headers.authorization.split(' ')[1],
            process.env.APP_SECRET_KEY,
            async (err, payload) => {
                if (payload) {
                    let user = await User.findByPk(payload.id)
                    if (user) {
                        clients.push({sid: socket.id, uid: socket.user.id})
                        return
                    }
                }
                socket.close()
            }
        )
    } else {
        socket.close()
        return
    }

    socket.emit('message', "I'm server")

    socket.on('message', (message) =>
        console.log('Message: ', message)
    )

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1)
        console.log(`Client with id ${socket.id} disconnected`)
    })
})

server.listen(process.env.APP_SOCKET_PORT, () => {
    console.log(`Socket server started at http://localhost:${process.env.APP_SOCKET_PORT}`)
})
