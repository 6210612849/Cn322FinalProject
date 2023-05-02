const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//passport
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: String,
    email: { type: String, unique: true},
    password: { type: String, required: true },
    token: String,
    secret: { type: String, required: true },
    verified: { type: Boolean, default: false },
});
UserSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", UserSchema);


module.exports = User;