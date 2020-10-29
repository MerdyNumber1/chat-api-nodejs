const jwt = require('jsonwebtoken')
const User = require('./../models/user')

function authMiddleware(req, res, next) {
    if(req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(' ')[1],
            process.env.APP_SECRET_KEY,
            async (err, payload) => {
                if (err) next()
                else if (payload) {
                    let user = await User.findByPk(payload.id)
                    if (user) {
                        req.user = user
                    }
                    next()
                }
            }
        )
    }
    next()
}

module.exports = authMiddleware
