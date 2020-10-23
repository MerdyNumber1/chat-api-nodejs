const sequelize = require('./database').sequelize
require('./../Models/User')

sequelize.sync({
    force: true
}).then(result => console.log(result))
    .catch(err=> console.log(err))
