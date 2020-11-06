const User = require('./../models/user')
const { Op } = require("sequelize")
const randomInt = require('./../utils/randomInt')
const redis = require('./../config/redis')
const mailer = require('./../config/mail')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const isObjectEmpty = require('./../utils/isObjectEmpty')


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
        return !isObjectEmpty(user)
    }
    async isUserConfirmed(email) {
        let user = await User.findOne({
            where: {
                email: email,
                confirmed: true
            }
        })
        return !!user
    }

    async register(name, email, password) {
        let response

        // creating a new user
        if (!await this.isUserExist(name, email)) {
            await User.create({
                name,
                password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
                email,
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
                text: `Link for confirm your account - ${process.env.APP_CLIENT_URL}/auth/confirm?email=${email}&code=${code}`,
            })
            await redis.asyncSet(`emailVerification:${email}`, code, 'EX', 5 * 60)
            response = {code: 200, payload: 'Confirmation code sent.'}
        }

        return response
    }

    async confirmUser(email, code) {
        let response

        if (!await this.isUserConfirmed(email)) {
            const serverCode = await redis.asyncGet(`emailVerification:${email}`)
            if (serverCode) {
                if (parseInt(serverCode) === parseInt(code)) {
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
        } else {
            response = {error: 'User already exists.', code: 400}
        }

        return response
    }

    async createToken(email, password) {
        let response
        let user = await User.findOne({
            where: {email}
        })

        if(!isObjectEmpty(user)) {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({id: user.id}, process.env.APP_SECRET_KEY)
                response = {code: 200, token}
            } else {
                response = {code: 400, error: 'Passwords dont match'}
            }
        } else {
            response = {code: 400, error: 'User doesnt exist'}
        }
        return response
    }
}


module.exports = AuthService
