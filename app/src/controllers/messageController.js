const Message = require('./../models/message')
const isObjectEmpty = require('./../utils/isObjectEmpty')

class MessageController {
    async getMessages(req, res) {
        let {limit, offset} = req.query
        limit = Number.isInteger(Number(limit)) && Number(limit) <= 50 ? limit : 50
        offset = Number.isInteger(Number(offset)) ? Number(offset) : 0
        const messages = await Message.findAll({
            offset,
            limit,
        })
        res.status(200).json(messages)
    }

    async create(payload) {
        if(!isObjectEmpty(payload.user)) {
            return await Message.create({
                text: payload.text,
                userId: payload.user.id
            })
        } else {
            throw new Error('Auth Error')
        }
    }
}

module.exports = MessageController
