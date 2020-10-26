const User = require('./../models/user')
const { Op } = require("sequelize");
const Validator = require('validatorjs')
const Service = require('./../services/authService')

const AuthService = new Service()


class UserController {
    async create(req, res) {

        // validation
        const isValid = new Validator({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
        }, {
            'name': 'required|min:3|max:16',
            'email': 'required|email',
            'password': 'required|min:6|max:32'
        })

        if(isValid.passes()) {
            /*let result = await AuthService.register(req.body.name, req.body.email, req.body.password)
            res.status(result.code).json(result)*/
            res.send(await AuthService.verificationEmail(req.body.email))
        } else { // send validation errors
            res.status(400).json(isValid.errors)
        }

    }
}


module.exports = UserController
