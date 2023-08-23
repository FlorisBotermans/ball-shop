const config = require('config')
const amqp = require("amqplib");
const EventHandler = require('../eventhandler/EventHandler');

let conn; // RabbitMQ connection
let ch; // RabbitMQ channel

module.exports.connect = async function connect() {
    try {
        conn = await amqp.connect(config.get('RabbitMQ'));
    } catch (e) {
        console.log("Unable to connect to RabbitMQ, retrying in 5 sec..");
        setTimeout(connect, 5000)
        return
    }
    ch = await conn.createChannel();
    await ch.assertExchange("ball.com", "fanout");
    await ch.assertQueue("CustomerSupport", { durable: true });
    await ch.bindQueue('CustomerSupport', 'ball.com', '')
    subscribeToQueue();
    console.log("Connected to RabbitMQ...");
};

async function subscribeToQueue() {
    const eventHandler = new EventHandler()
    await ch.consume("CustomerSupport", async (msg) => {
        if (msg !== null) {
            if (msg.properties.headers.MessageType == 'CustomerRegistered') {
                try {
                    console.log("CustomerRegistered message received!");
                    // No longer double-JSON
                    console.log(msg);
                    const body = JSON.parse(msg.content)
                    await eventHandler.customerRegistered(body.data)
                } catch (e) {
                    console.log(e);
                    return
                }
                ch.ack(msg)
            }
            else if(msg.properties.headers.MessageType == 'CustomerUpdated')
            {
                try {
                    console.log("CustomerUpdated message received!");
                    const body = JSON.parse(msg.content)
                    await eventHandler.customerUpdated(body.data)
                } catch (e) {
                    console.log(e);
                    return
                }
                ch.ack(msg)
            }
            else if (msg.properties.headers.MessageType == 'CustomerDeleted')
            {
                try {
                    console.log("CustomerDeleted message received!");
                    const body = JSON.parse(msg.content)
                    await eventHandler.customerUpdated(body.data)
                } catch (e) {
                    console.log(e);
                    return
                }
                ch.ack(msg)
            }
            else {
                //console.log(`We don't react to messageType ${msg.properties.headers.MessageType}`)
                ch.ack(msg)
            }
        }
    });
}

module.exports.publishEvent = async function publishEvent(event) {
    console.log(`Sending event: ${event.type}`)
    ch.publish("ball.com", "", Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } });
};