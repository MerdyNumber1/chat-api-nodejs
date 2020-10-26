const User = require('./../models/user')
const { Op } = require("sequelize");
const Validator = require('validatorjs')
const Service = require('./../services/authService')

const AuthService = new Service()


class UserController {
    async create(req, res) {
        let {name, email, password, code} = req.body

        // validation
        const isValid = new Validator({
            name,
            password,
            email,
            code
        }, {
            'name': 'required|min:3|max:16',
            'email': 'required|email',
            'password': 'required|min:6|max:32',
            'code': 'integer|min:1000|max:9999'
        })

        if(isValid.passes()) {

            if(!await AuthService.isUserExist(name, email)) {

                if (code) {
                    const isVerified = await AuthService.verificationEmail(email, code)
                    if (isVerified.code === 200) {
                        let result = await AuthService.register(name, email, password)
                        res.status(result.code).json(result)
                    } else {
                        res.status(isVerified.code).json(isVerified)
                    }
                } else {
                    const isSent = await AuthService.verificationEmail(email)
                    if (isSent.code === 200) {
                        res.status(isSent.code).json(isSent)
                    } else {
                        res.status(isSent.code).json(isSent)
                    }
                }

            } else {
                res.status(400).json({'errors': {'exist': ['User already exists.']}, 'code': 400})
            }


        } else { // send validation errors
            res.status(400).json(isValid.errors)
        }

    }
}


module.exports = UserController
