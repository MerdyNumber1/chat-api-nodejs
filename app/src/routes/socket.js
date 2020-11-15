const server = require('http').createServer()
const io = require('socket.io')(server)
const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const moment = require('moment')
const Controller = require('./../controllers/messageController')
const {authSocketMiddleware} = require('./../middlewares/authMiddleware')
const redis = require('./../config/redis')

const MessageController = new Controller()


io.of('chat').use(authSocketMiddleware)

io.of('chat').on('connection', async socket => {
    console.log('connected')

    try {

        const user = JSON.parse(await redis.asyncGet(`clients:${socket.id}`))

        socket.on('message', async (textMessage) => {
            //console.log(textMessage)
            await MessageController.create({
                user,
                text: textMessage
            })
            socket.broadcast.emit('message', {
                text: textMessage,
                name: user.name,
                time: moment().format()
            })
        })

        socket.on('disconnect', () => {
            redis.del(`clients:${socket.id}`)
            console.log(`Client with id ${socket.id} disconnected`)
        })

    } catch(e) {
        if(e.message === 'Auth Error') {
            socket.emit('authError', 'Authentication error')
            socket.disconnect()
        } else {
            socket.emit('serverError', 'An error occurred on the server')
            socket.disconnect()
        }
    }
})

module.exports = server
