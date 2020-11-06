const sequelize = require('./../database/database').sequelize
const Sequelize = require('sequelize')

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


module.exports = Message
