const User = require('./../models/user')
const { Op } = require("sequelize");
const Validator = require('validatorjs')


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
            // looking for existing user
            let user = await User.findOne({
                where: {
                    [Op.or]: {
                        email: req.body.email,
                        name: req.body.name
                    }
                }
            })

            if(!user) {
                // creating a new user
                User.create({
                    name: req.body.name,
                    password: req.body.password,
                    email: req.body.email
                })
                    .then(result => res.status(201).json({
                        'status': 'ok',
                        'payload': result
                    }))
                    .catch(err => res.status(400).json({'errors': {'server': ['An error occurred on the server.']}}))

            } else {
                // error, user exists
                res.status(400).json({'errors': {'exist': ['User already exists.']}})
            }

        } else { // отправляем ошибки
            res.status(400).json(isValid.errors)
        }
    }
}


module.exports = UserController
