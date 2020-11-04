const server = require('http').createServer()
const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')
const User = require('./../models/user')

const clients = []

io.use((socket, next) => {
    socket.user = null
    if(socket.handshake.query['token']) {
        jwt.verify(
            '12312321',
            process.env.APP_SECRET_KEY,
            async (err, payload) => {
                if (payload) {
                    let user = await User.findByPk(payload.id)
                    if (user) {
                        clients.push({sid: socket.id, uid: user.id})
                        console.log(1)
                        next()
                        return
                    }
                }
                socket.emit('auth_error', 'Authentication error')
                socket.disconnect()
            }
        )
    } else {
        console.log(3)
        socket.emit('auth_error', 'Authentication error')
        socket.disconnect()
    }
})

io.of('/chat').on('connection', socket => {
    console.log('connected')

    socket.emit('message', "I'm server")

    socket.on('message', (message) =>
        console.log('Message: ', message)
    )

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1)
        console.log(`Client with id ${socket.id} disconnected`)
    })
})

module.exports = server
