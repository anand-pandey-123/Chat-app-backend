const mongoose = require('mongoose')
require('dotenv').config()


const connection = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI+'/chat-app')
        console.log("DB connected successfully")
        return
    } catch (error) {
        console.log("error while DB connectiong")
        console.log(error)
        process.exit(1);
    }
}

module.exports = {connection}