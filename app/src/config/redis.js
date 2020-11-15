const redis = require('redis')
const {promisify} = require('util')


const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})

client.on('error', (error) => console.error(error))

client.asyncGet = promisify(client.get).bind(client)
client.asyncSet = promisify(client.set).bind(client)

module.exports = client
