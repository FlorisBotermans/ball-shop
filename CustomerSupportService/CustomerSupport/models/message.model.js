const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    // Populate before saving! 
    sender: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;