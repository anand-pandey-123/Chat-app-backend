const Chat = require("../models/chat");

const getAllChats = async (req, res) => {
  try {
    console.log(req.params.targetId);
    console.log(req.user.id);
    const userId = req.user.id;
    const targetId = req.params.targetId;
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetId] },
    })
      .populate({
        path: "messages",
        populate: {
          path: "sender",
          select: "firstName lastName", // or whatever fields you want
        },
      })
      .populate("participants", "firstName");

    if (!chat) {
      chat = await Chat.create({
        participants: [userId, targetId],
        messages: [],
      });
    }

    // console.log(chat)
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllChats,
};
