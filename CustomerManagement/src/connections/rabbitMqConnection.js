const config = require('config')
const amqp = require("amqplib");
const EventHandler = require('../handlers/EventHandler');

let connection; // RabbitMQ connection
let channel; // RabbitMQ channel

let queueName = "CustomerManagementService"
let exchangeName = "ball.com"

module.exports.connect = async function connect() {
    try {
        connection = await amqp.connect(config.get('RABBIT_MQ_URL'));
    } catch (e) {
        console.log("Unable to connect to RabbitMQ, retrying in 5 sec..");
        setTimeout(connect, 5000)
        return
    }

    channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "fanout");
    await channel.assertQueue(queueName, {
        durable: true
    });
    await channel.bindQueue(queueName, exchangeName, '')

    subscribeToQueue();
    console.log("Connected to RabbitMQ");
};

async function subscribeToQueue() {
    const eventHandler = new EventHandler()
    await channel.consume(queueName, async (message) => {
        if (message !== null) {
            // console.log(message)
            // const body = JSON.parse(message.content)
            console.log('Incoming message: ' + message.properties.headers.MessageType)
            switch (message.properties.headers.MessageType) {
                case "RandomCustomerEvent":
                    try {
                        let body = message.content.toString('utf8')
                        let json = JSON.parse(body)
                        // console.log(json)
                        await eventHandler.randomCustomerRequested(json)
                    } catch (e) {
                        console.log(e)
                        return
                    }
                    break;
                case "NoRandomCustomerEvent":
                    try{
                        const https = require('https')
                        https.get('https://hook.integromat.com/95ahxj1stqfc74o1fno8ktehte1t5n5f', (resp) =>{
                            // console.log(resp)
                        })
                    }catch(e){
                        console.log(e)
                        return
                    }
                    break;
                default:
                    console.log("Not reacting to: " + message.properties.headers.MessageType)
                    break;
            }
            channel.ack(message)
        }
    });
}

module.exports.publishEvent = async function publishEvent(event) {
    console.log(`Sending event: ${event.type}`)
    channel.publish(exchangeName, "", Buffer.from(JSON.stringify(event.json)), {
        headers: {
            MessageType: event.type
        }
    });
};