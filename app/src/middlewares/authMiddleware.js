const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const isObjectEmpty = require('./../utils/isObjectEmpty')

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

module.exports = authMiddleware
