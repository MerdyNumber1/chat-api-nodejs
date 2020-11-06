const sequelize = require('./../database/database').sequelize
const Sequelize = require('sequelize')
const Message = require('./message')

const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
})

User.hasMany(Message, {onDelete: 'cascade'})

module.exports = User
