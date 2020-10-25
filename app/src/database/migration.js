const sequelize = require('./database').sequelize
require('./../models')

sequelize.sync({
    force: true
})
    .then(() => {
        console.log('Migration is completed')
        process.exit()
    })
    .catch(err=> console.log(err))
