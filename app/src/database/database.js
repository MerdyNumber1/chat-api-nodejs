const Sequelize = require("sequelize");
require('dotenv').config()
const path = require('path')


let sequelize

if(process.env.DB_DIALECT === 'mysql') {
     sequelize = new Sequelize(
        process.env.DB_DATABASE,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            dialect: process.env.DB_DIALECT,
            host: process.env.DB_HOST,
            logging: false
        }
    )
} else if (process.env.DB_DIALECT === 'sqlite') {
    sequelize = new Sequelize(
        'localhost',
        'root',
        'root',
        {
            dialect: 'sqlite',
            storage: path.join(__dirname, '../..', `${process.env.DB_DATABASE}.sqlite`),
            logging: false
        }
    )
}

module.exports = {
    sequelize
}

