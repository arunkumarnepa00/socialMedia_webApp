const mongoose = require('mongoose');
const { ObjectId }= require('mongoose');
//const User= require('../Models/user');

const conversationSchema = new mongoose.Schema({
    members:{
        type:Array
    }
},{timestamps:true})

module.exports=mongoose.model('Conversation',conversationSchema);