const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImg: {
        type: String,
    },
    bio: {
        type: String,
    }
}, {
    timeStamps: true
})



const User = mongoose.model("User", userSchema)
module.exports = User;