const User = require('./../models/user')
const { Op } = require("sequelize");
const Validator = require('validatorjs')
const Service = require('./../services/authService')
const isObjectEmpty = require('./../utils/isObjectEmpty')

const AuthService = new Service()


class UserController {
    async create(req, res) {
        const {name, email, password} = req.body
        console.log(name, email, password)
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
            res.status(400).json({
                error: isValid.errors.first('email') ||
                    isValid.errors.first('name') ||
                    isValid.errors.first('password')
            })
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
            res.status(400).json(isValid.errors.first('email') ||
                isValid.errors.first('code'))
        }
    }

    async auth(req, res) {
        const {email, password} = req.body

        const isValid = new Validator({
            email,
            password
        }, {
            'email': 'required|email',
            'password': 'required|min:6|max:32'
        })

        if(isValid.passes()) {
            let response = await AuthService.createToken(email, password)
            res.status(response.code).json(response)
        } else { // send validation errors
            res.status(400).json(isValid.errors)
        }
    }

    getCurrent(req, res) {
        if(!isObjectEmpty(req.user)) {
            res.status(200).json({
                email: req.user.email,
                name: req.user.name
            })
        } else {
            res.status(401).json({
                error: 'Auth error'
            })
        }
    }
}


module.exports = UserController
