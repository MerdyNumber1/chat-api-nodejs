const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const isObjectEmpty = require('./../utils/isObjectEmpty')
const redis = require('./../config/redis')

async function authMiddleware(req, res, next) {
    if(req.headers.authorization) {
        await jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.APP_SECRET_KEY,
            async (err, payload) => {
                if (payload) {
                    let user = await User.findByPk(payload.id)
                    if (!isObjectEmpty(user)) {
                        req.user = {
                            email: user.email,
                            name: user.name
                        }
                    }
                }
            }
        )
    }
    next()
}
async function authSocketMiddleware(socket, next) {
    socket.user = null
    if(socket.handshake.query['token']) {
        await jwt.verify(
            socket.handshake.query['token'],
            process.env.APP_SECRET_KEY,
            async (err, payload) => {
                if (payload) {
                    let user = await User.findByPk(payload.id)
                    if (user) {
                        redis.set(`clients:${socket.id}`, JSON.stringify({
                            sid: socket.id,
                            name: user.name,
                            email: user.email,
                            id: user.id
                        }))
                        next()
                        return
                    }
                }
                socket.emit('authError', 'Authentication error')
                socket.disconnect()
            }
        )
    } else {
        socket.emit('authError', 'Authentication error')
        socket.disconnect()
    }
}

module.exports = {
    authMiddleware,
    authSocketMiddleware
}
