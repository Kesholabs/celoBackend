const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    Name: {type:String,required:[true,'required name']},
    Email: {type:String,required:[true,'required email'],unique:true},
    Password:{type:String,required:true},
    Wallet: {type:Object},
})

module.exports = mongoose.model('user',userSchema)