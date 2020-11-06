const server = require('http').createServer()
const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const moment = require('moment')

const clients = []

io.use(async (socket, next) => {
    socket.user = null
    if(socket.handshake.query['token']) {
        await jwt.verify(
            socket.handshake.query['token'],
            process.env.APP_SECRET_KEY,
            async (err, payload) => {
                if (payload) {
                    let user = await User.findByPk(payload.id)
                    if (user) {
                        clients.push({
                            sid: socket.id,
                            name: user.name,
                            email: user.email
                        })
                        next()
                        return
                    }
                }
                console.log(2)
                socket.emit('authError', 'Authentication error')
                socket.disconnect()
            }
        )
    } else {
        console.log(3)
        socket.emit('authError', 'Authentication error')
        socket.disconnect()
    }
})

io.of('/chat').on('connection', socket => {
    console.log('connected')

    const user = clients.find(client => socket.id.includes(client.sid))


    socket.on('message', (textMessage) => {
        socket.broadcast.emit('message', {
            text: textMessage,
            name: user.name,
            time: moment().format()
        })
    })

    socket.on('disconnect', () => {
        clients.splice(clients.indexOf(socket.id), 1)
        console.log(`Client with id ${socket.id} disconnected`)
    })
})

module.exports = server
