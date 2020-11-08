const sequelize = require('./../database/database').sequelize
const Sequelize = require('sequelize')
const User = require('./user')

const Message = sequelize.define("message", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
})

Message.belongsTo(User)

module.exports = Message
