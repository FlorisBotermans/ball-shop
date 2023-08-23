const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    role:{
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String
    },
    city: {
        type: String
    },
    telephone: {
        type: String
    }
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;