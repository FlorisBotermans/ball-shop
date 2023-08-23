const amqp = require('amqplib/callback_api')
const consumer = require('../message_exchange/consumer')

//Sets configurable options for the RabbitMQ
const dbConfig = require("../" + process.env.DATABASE_CONFIG_LOCATION || "../../database_config.json")
if (process.env.DOCKER) host = `${dbConfig.baseRabbitMqHost}`
else host = `${dbConfig.localhostRabbitMqHost}`
let exchange = 'ball.com'
let keys = ['inventory.product.#', 'inventory.retailer.#']
let queue = 'inventory-query-service-queue'

module.exports = {
    openConnection: function openConnection(retries = 0) {
        amqp.connect(host, (err, conn) => {
            // An error occurred while connecting to the RabbitMQ server
            if (err){
                if (retries < 60) {
                    // First 2 minutes, it will retry to connect every two seconds 
                    setTimeout(() => {
                        openConnection(retries + 1)
                    }, 2000);
                } else {
                    // After that, it will try to connect every minute
                    setTimeout(() => {
                        openConnection(retries + 1)
                    }, 60000);
                }
            } else {
                // If the connection gets lost, try to connect again
                conn.addListener('close', () => { openConnection() })
                conn.createChannel((err, channel) => {
                    if (err) console.log("Could not create RabbitMQ channel")
                    else {
                        // Checks if the exchange 'default' exists, otherwise creates a new exchange of type 'topic'
                        channel.assertExchange(exchange, 'fanout', { durable: true })
                        // Checks if the queue 'inventory-query-service-queue' exists, otherwise creates it
                        channel.assertQueue(queue, { durable: true }, (err, q) => {
                            if (err) console.log("Could not connect to RabbitMQ queue")
                            else {
                                // Bind the queue to every key we are listening for
                                keys.forEach((key) => {
                                    channel.bindQueue(q.queue, exchange, key);
                                })

                                // Send all incoming messages to the consumer
                                channel.consume(q.queue, (message) => {
                                    consumer.consumeMsg(message, (msg) => {
                                        channel.ack(msg)
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    }
}
