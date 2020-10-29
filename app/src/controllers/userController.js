const User = require('./../models/user')
const { Op } = require("sequelize");
const Validator = require('validatorjs')
const Service = require('./../services/authService')

const AuthService = new Service()


class UserController {
    async create(req, res) {
        const {name, email, password} = req.body

        // validation
        const isValid = new Validator({
            name,
            password,
            email,
        }, {
            'name': 'required|min:3|max:16',
            'email': 'required|email',
            'password': 'required|min:6|max:32'
        })

        if(isValid.passes()) {
            let response = await AuthService.register(name, email, password)
            res.status(response.code).json(response)
        } else { // send validation errors
            res.status(400).json(isValid.errors)
        }
    }

    async confirmUser(req, res) {
        const {email, code} = req.body

        const isValid = new Validator({
            email,
            code
        }, {
            'email': 'required|email',
            'code': 'required|integer|min:1000|max:9999'
        })

        if(isValid.passes()) {
            let response = await AuthService.confirmUser(email, code)
            res.status(response.code).json(response)
        } else { // send validation errors
            res.status(400).json(isValid.errors)
        }
    }

    async auth(req, res) {
        const {name, password} = req.body

        const isValid = new Validator({
            name,
            password
        }, {
            'name': 'required|min:3|max:16',
            'password': 'required|min:6|max:32'
        })

        if(isValid.passes()) {
            let response = await AuthService.createToken(name, password)
            res.status(response.code).json(response)
        } else { // send validation errors
            res.status(400).json(isValid.errors)
        }
    }
}


module.exports = UserController
