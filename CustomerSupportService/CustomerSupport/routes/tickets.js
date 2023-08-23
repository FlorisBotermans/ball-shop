const router = require('express').Router();
let Ticket = require('../models/ticket.model');
let User = require ('../models/user.model');
let Message = require('../models/message.model');
let Event = require ('../models/event.model');
const rabbitMQ = require('../connections/RabbitMQ');

// Get all tickets
router.route('/').get((req, res) => {
    Ticket.find()
    .then(tickets => res.json(tickets))
    .catch(err => res.status(400).json('error: ' + err))
});

// Get specific ticket
router.route("/:ticketid").get((req, res) => {
    const _id = req.params.ticketid;
    
    Ticket.findOne({id: id})
    .populate('contents')
    .then(t => res.json(t))
    .catch(err => res.status(400).json('error: ' +err));
});

// Add ticket
router.route('/').post((req, res) => {
    // tickets are always made with an initial message
    const content = req.body.content;
    const status = req.body.status;
    const sender = req.body.sender;
    // const m = new Message(sender, content, new Date());

    const newTicket = new Ticket({status});
    const m = new Message({content, sender})
    m.save();
    newTicket.contents.push(m);
    newTicket.save()
    .then(() => res.json('Ticket added succesfully!'))
    .catch(err => res.status(400).json('error' + err));

    const newEvent = new Event({
        header: 'TicketRegistered',
        data: newTicket
    });
    newEvent.save();

    // TODO: Send events
    // rabbitMQ.publishEvent)();
    // Send out an event, store event in event store
})

// Update ticket
// In this case we will be adding a Message object to the contents
// A ticket can also be updated if it's finished, this will be specified in the request body
router.route('/:ticketid').put((req, res) => {
    const finished = req.body.isfinished;
    const filter = {_id : req.params.ticketid};
    if(finished === "true" && finished != undefined){
        // Update the ticket to be finished. Send out an event.
        const update = {
            status: "FINISHED"
        };
        Ticket.findOneAndUpdate(filter, update)
        .then (result => res.json(result))
        .catch (err => res.status(400).json('error ' + err));

        Ticket.findOne(filter)
        .then((ticket) => {
            const newEvent = new Event({
                header: 'TicketClosed',
                data: ticket
            });
            newEvent.save();
        })

    } else {
        // Add a new message to the ticket thread. Send out an event.
        const content = req.body.content;
        const sender = req.body.sender;
        const m = new Message({content, sender})
        m.save();
        Ticket.findOne(filter)
        .then((ticket) => {
            ticket.contents.push(m);

            const newEvent = new Event({
                header: 'TicketUpdated',
                data: ticket
            });
            newEvent.save();

            ticket.save()
            .then(() => res.json('Message has been succesfully added to ticket'))
            .catch(err => res.status(400).json('error: ' + err));
        })
    }
})

// Remove ticket
router.route('/:ticketid').delete((req, res) => {
    const id = req.params.ticketid;

    Ticket.find({_id: id}).deleteOne()
    .then(() => res.json({"Message" : 'Ticket has been deleted!'}))
    .catch(err => res.status(400).json('error ' + err));
})

// function Message(_id, sender, content, date) {
//     this.sender = sender;
//     this.content = content;
//     this.date = date;
// }

module.exports = router;