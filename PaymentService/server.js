const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const routes = require('./routes/routes')
const app = express()

app.use(cors())
app.use(bodyParser.json())

routes(app)

const RabbitMQ = require('./connections/rabbitmq');
RabbitMQ.connect();

const PORT = process.env.PORT || 5102
app.listen(PORT, () => {
    console.log(`running on port ${ PORT }`)
})