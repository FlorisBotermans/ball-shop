const amqp = require('amqplib/callback_api');

module.exports = {
    publishMsg(key, message,messagetype) {
        // Connects to the RabbitMQ server
        amqp.connect('amqps://ryjrqstr:M6yFGn18THrnp6yhoc8P_okfsBCRHX9x@whale.rmq.cloudamqp.com/ryjrqstr', function(err, conn) {
            if (err){
                console.log("Could not connect to RabbitMQ server")
                console.log(err);
                console.log(conn);
            }
            
            // Creates a channel to communicatie through
            conn.createChannel(function(err, channel) {
                if (err){
                    console.log("Could not create RabbitMQ channel")
                }

                let exchange = 'ball.com'
                
                // Checks if the exchange 'default' exists, otherwise creates a new exchange of type 'topic'
                channel.assertExchange(exchange, 'fanout', {
                    // The exchange will survive a broker restart
                    durable: true
                })

                // Publishes the message to the exchange
                channel.publish(exchange, key, Buffer.from(JSON.stringify(message)),{headers:{MessageType: messagetype}})
            })
            // Closes the connection to the RabbitMQ server
            setTimeout(function() { 
                conn.close(); 
            }, 500);
        });  
    }
}
