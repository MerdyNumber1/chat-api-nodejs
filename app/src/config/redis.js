const redis = require('redis')
const {promisify} = require('util')


const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

client.on('error', (error) => console.error(error))

const asyncGetRedis = promisify(client.get).bind(client)
const asyncSetRedis = promisify(client.set).bind(client)

module.exports = {
    client,
    asyncGetRedis,
    asyncSetRedis
}
