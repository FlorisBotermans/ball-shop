const amqp = require('amqplib')
const EventHandler = require('../handlers/event-handler')

let connection
let channel

module.exports.connect = async function connect() {
    try {
        connection = await amqp.connect('amqps://ryjrqstr:M6yFGn18THrnp6yhoc8P_okfsBCRHX9x@whale.rmq.cloudamqp.com/ryjrqstr')
    } catch (e) {
        console.log('unable to connect to RabbitMQ, retrying in 5 sec')
        setTimeout(connect, 5000)
        return
    }
    channel = await connection.createChannel()
    await channel.assertExchange('ball.com', 'fanout')
    await channel.assertQueue('PaymentService', { durable: true })
    await channel.bindQueue('PaymentService', 'ball.com', '')
    subscribeToQueue()
    console.log('connected to RabbitMQ')
}

async function subscribeToQueue() {
    const eventHandler = new EventHandler()
    await channel.consume('PaymentService', async (msg) => {
        if (msg !== null) {
            if (msg.properties.headers.MessageType == 'OrderRegisteredEvent') {
                try {
                    const body = JSON.parse(msg.content)
                    console.log(body)
                    await eventHandler.orderRegistered(body.data)
                } catch (e) {
                    console.log(e)
                    return
                }
                channel.ack(msg)
            }
            else {
                channel.ack(msg)
            }
        }
    })
}

module.exports.publishEvent = async function publishEvent(event) {
    console.log(`Sending event: ${event.type}`)
    channel.publish('ball.com', '', Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } })
}