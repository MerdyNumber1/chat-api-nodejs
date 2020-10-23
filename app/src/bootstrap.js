// routing
const routes = require('./routes/web').routes
require('dotenv').config()

routes.listen(process.env.APP_PORT)

//database
require('./database/database')
