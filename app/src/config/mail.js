const nodemailer = require('nodemailer')

const mailer = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
    }
})

module.exports = mailer
