const socket = require('socket.io');
const crypto = require('crypto');
const Chat = require('../models/chat');
const Message = require('../models/message');

const getRoomId = (userId, targetId) => {
    return crypto.createHash('sha256').update([userId, targetId].sort().join("_")).digest('hex');
}



const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
        }
    })
    

    io.on("connection", (socket) => {
        //handle socket events here
        // console.log("socket connection...", socket.id)
        socket.on("joinChat", ({userId, targetId, sender}) => {

            const roomId = getRoomId(userId, targetId);

            console.log(sender+" joining room : "+roomId)
            socket.join(roomId)
        });

        socket.on("sendMessage", async ({firstName, userId, targetId, newMessage}) => {
            const roomId = getRoomId(userId, targetId);
            try {
                let chat = await Chat.findOne({participants: {$all: [userId, targetId]}});
                
                if(!chat){
                    chat = await Chat.create({
                        participants: [userId, targetId],
                        messages: []
                    });
                }

                const message = await Message.create({
                    sender: userId,
                    text: newMessage
                });

                chat.messages.push(message._id);

                await chat.save();
                io.to(roomId).emit("messageReceived", {firstName, userId, targetId, newMessage});
            } catch (error) {
                console.log(error)
            }
        });

        socket.on("disconnect", () => {});
    })
}

module.exports = initializeSocket;