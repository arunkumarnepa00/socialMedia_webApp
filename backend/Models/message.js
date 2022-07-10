const mongoose = require('mongoose');
const {ObjectId}= require('mongoose');
const Conversation= require('./conversation');

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:ObjectId,
        ref:'Conversation'
    },
    text:{
        type:String
    },
    senderId:{
        type:String
    }
},{timestamps:true})

module.exports=mongoose.model('Message',messageSchema);