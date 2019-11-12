const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: String,
    sub: String,

})

const User = mongoose.model('userschema', UserSchema)

module.exports = User 