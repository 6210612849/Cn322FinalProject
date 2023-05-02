const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//passport


const ChatRoomSchema = new Schema({
    chatRoomID: { type: String, unique: true },
    chatInviteID: { type: String, },
    email: [{ type: String }],
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
    key1: { type: String },
    key2: { type: String }
    // email: { type: String, unique: true},
    // password: String,
    // token: String,
    // verified: { type: Boolean, default: false },
});


const ChatRoom = mongoose.model("RealChatRoom", ChatRoomSchema);


module.exports = ChatRoom;