const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//passport


const KeyPairSchema = new Schema({
    email: { type: String, unique: true },
    created: { type: Date, default: Date.now() },
    updated: { type: Date, default: Date.now() },
    public: { type: String },
    private: { type: String }
    // email: { type: String, unique: true},
    // password: String,
    // token: String,
    // verified: { type: Boolean, default: false },
});


const KeyPair = mongoose.model("RealKeyPair", KeyPairSchema);


module.exports = KeyPair;