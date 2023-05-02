const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//passport


const TokenSchema = new Schema({
    token: { type: String, unique: true },
    email: { type: String }

});

const Token = mongoose.model("RealToken", TokenSchema);


module.exports = Token;