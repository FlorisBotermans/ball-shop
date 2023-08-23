const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true
    },

    // Contents include a list of back-and-forth on the question, answers from both sides.
    // Message contains the sender's ID, the contents, the date it was sent, and its own ID.
    contents: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
        required: true
    }],
},
    { timestamps: true }
);

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;