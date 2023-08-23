const config = require('config')
const amqp = require("amqplib");
const EventHandler = require('../Handlers/EventHandler');

let conn; // RabbitMQ connection
let ch; // RabbitMQ channel

module.exports.connect = async function connect() {
    try {
        conn = await amqp.connect(config.get('RABBIT_MQ_URL'));
    } catch (e) {
        console.log("Unable to connect to RabbitMQ, retrying in 5 sec..");
        setTimeout(connect, 5000)
        return
    }
    ch = await conn.createChannel();
    await ch.assertExchange("ball.com", "fanout");
    await ch.assertQueue("OrderService", { durable: true });
    await ch.bindQueue('OrderService', 'ball.com', '')
    subscribeToQueue();
    console.log("Connected to RabbitMQ");
};
async function subscribeToQueue() {
    const eventHandler = new EventHandler()
    await ch.consume("OrderService", async (msg) => {
        if (msg !== null) {
            const body = JSON.parse(msg.content)
            console.log(msg.properties.headers.MessageType)
            switch(msg.properties.headers.MessageType){
                case "CustomerRegistered":            
                    try {await eventHandler.customerRegistered(body)}
                    catch (e) { return}
                    break;
                case "ProductRegistered":
                    try {await eventHandler.productRegistered(body)} 
                    catch (e) { return }
                    break;
                case "PaymentHandled":
                    try {await eventHandler.orderStatusUpdated(body)}
                    catch (e) { return }
                    break;
                case "ProductUpdated":
                    try {await eventHandler.updateproduct(body)} 
                    catch (e) {return}
                    break;
                default:
                    console.log("Not reacting to: "+msg.properties.headers.MessageType)
                    break;
            }
            ch.ack(msg)
        }
    });
}
module.exports.publishEvent = async function publishEvent(event) {
    console.log(`Sending event: ${event.type}`)
    ch.publish("ball.com", "", Buffer.from(JSON.stringify(event.json)), { headers: { MessageType: event.type } });
};