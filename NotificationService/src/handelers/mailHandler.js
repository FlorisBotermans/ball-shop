'use strict'
const nodemailer = require('nodemailer');
const transporter  = nodemailer.createTransport({
  service: 'hotmail',
  pool:true,
  maxConnections: 10,
  maxMessages:200,
  auth: {
    user: 'solutionArchitectureBall@hotmail.com',
    pass: 'W6bvNucaJ72e376'
  },
  tls: {
      rejectUnauthorized: false
  }
});
module.exports = class mailHandler {
    async  sendMail(data) {
      console.log(data)
        var mailOptions = {
            from: 'solutionArchitectureBall@hotmail.com',
            to: data.customer.email,
            subject: 'Info Bestelling Ball.com',
            text: "Beste Klant, U order met Ordernummer: "+data.order.orderNumber+" heeft de volgende status: "+ data.order.orderStatus
          };
          
          await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    }
}
