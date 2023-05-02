const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//passport


const MessageSchema = new Schema({
    messageID: { type: String, unique: true },
    roomID: { type: String, },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
    payload: { type: String },
    writedBy: { type: String },
    iv: { type: String }
    // email: { type: String, unique: true},
    // password: String,
    // token: String,
    // verified: { type: Boolean, default: false },
});


const Message = mongoose.model("RealMessage", MessageSchema);


module.exports = Message;