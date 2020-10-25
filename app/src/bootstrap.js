//database
require('./database/database')

// routing
const routes = require('./routes/web').routes
require('dotenv').config()

routes.listen(process.env.APP_PORT, () => {
    console.log(`Node.js server started at http://localhost:${process.env.APP_PORT}`)
})
