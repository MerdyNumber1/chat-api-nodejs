const User = require('./../models/user')
const { Op } = require("sequelize")
const randomInt = require('./../utils/randomInt')
const redis = require('./../config/redis')
const mailer = require('./../config/mail')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


class AuthService {

    async isUserExist(name, email) {
        let user = await User.findOne({
            where: {
                [Op.or]: {
                    email: email,
                    name: name
                }
            }
        })
        return !!user
    }

    async register(name, email, password) {
        let response

        // creating a new user

        if (!await this.isUserExist(name, email)) {
            await User.create({
                name: name,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email: email,
                confirmed: false,
            })
            // sending verification
            response = await this.sendVerificationCode(email)
        } else {
            response = {error: 'User already exists.', code: 400}
        }

        return response
    }

    async sendVerificationCode(email) {
        let response

        if (await redis.asyncGet(`emailVerification:${email}`)) { // if verification code sent
            response = {code: 400, error: 'Confirmation code already sent.'}
        } else {
            let code = randomInt(1000, 9999)
            await mailer.sendMail({
                from: 'Chat',
                to: email,
                subject: 'Verification code for registration in chat',
                text: `Your verification code is - ${code}`,
            })
            await redis.asyncSet(`emailVerification:${email}`, code, 'EX', 5 * 60)
            response = {code: 200, payload: 'Confirmation code sent.'}
        }

        return response
    }

    async confirmUser(email, code) {
        let response

        const serverCode = await redis.asyncGet(`emailVerification:${email}`)

        if (serverCode) {
            if(parseInt(serverCode) === parseInt(code)) {
                await User.update({confirmed: true}, {
                    where: {email}
                })
                response = {code: 200, payload: 'User confirmed.'}
            } else {
                response = {code: 400, error: 'Verification code does not match.'}
            }
        } else {
            response = {code: 400, error: 'Confirmation code expired or did not send.'}
        }

        return response
    }

    async createToken(name, password) {
        let response
        let user = await User.findOne({
            where: {name}
        })
        if(await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({id: user.id}, process.env.APP_SECRET_KEY)
            response = {code: 200, payload: {token}}
        } else {
            response = {code: 400, error: 'Passwords dont match'}
        }
        return response
    }
}


module.exports = AuthService
