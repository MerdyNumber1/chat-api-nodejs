const redis = require('./../config/redis')
require('dotenv').config()

async function rateLimitSocketMiddleware(sid, user, collection, connection) {
    let userData = await redis.asyncGet(`${collection}:${sid}`)
    let rateCount = ++(userData).rateCount
    let {rateClear} = userData
    if(Math.abs(new Date() - rateClear) > 60000) {
        rateClear = new Date()
    } else {
        if(rateCount > process.env.APP_MAX_SEND_MESSAGE_REQUESTS_PER_MINUTE) {
            connection.emit('FloodError', 'Too many requests')
            connection.disconnect()
            return false
        }
    }

    await redis.asyncSet(`${collection}:${sid}`, JSON.stringify({
        sid: sid,
        name: user.name,
        email: user.email,
        id: user.id,
        rateCount,
        rateClear
    }))
    return true
}

module.exports = rateLimitSocketMiddleware