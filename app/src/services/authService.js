const User = require('./../models/user')
const { Op } = require("sequelize")
const randomInt = require('./../utils/randomInt')
const redis = require('./../config/redis')
const mailer = require('./../config/mail')


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
    async register(name, email ,password) {
        // looking for existing user
        let response = {}
        if(!await this.isUserExist(name, email)) {
            // creating a new user
            try {
                let user = await User.create({
                    name: name,
                    password: password,
                    email: email
                })
                response = {
                    'status': 'ok',
                    'payload': user,
                    'code': 201
                }
            } catch (err) {
                response = {'errors': {'server': ['An error occurred on the server.']}, 'code': 500}
            }
            return response
        } else {
            // error, user exists
            response = {'errors': {'exist': ['User already exists.']}, 'code': 400}
        }
        return response
    }
    async verificationEmail(email, code) {
        let response = {code: 500}

        if(!code) { // if we have to sent ver. code

            if (await redis.asyncGet(`emailVerification:${email}`)) { // if verification code sent
                response = {code: 400, errors: {'verificationEmail': 'Confirmation code already sent.'}}
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

        } else { // if we have to confirm ver. code

            let serverCode = await redis.asyncGet(`emailVerification:${email}`)

            if (await redis.asyncGet(`emailVerification:${email}`)) {

                if(serverCode == code) {
                    response = {code: 200, payload: 'Verification code confirmed.'}
                } else {
                    response = {code: 400, errors: {'verificationEmail': 'Verification code does not match.'}}
                }

            } else {
                response = {code: 400, errors: {'verificationEmail': 'Confirmation code expired.'}}
            }

        }

        return response
    }
}


module.exports = AuthService
