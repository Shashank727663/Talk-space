const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
  {
    chatName: { type: String, required: true, trim: true },
    isGrouchat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    Admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  {
    timestamps: true
  }
);

const chat = mongoose.model("Chat", chatModel);
module.exports = chat;
