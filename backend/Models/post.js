const mongoose=require('mongoose');
const User=require('../Models/user')
const {ObjectId}=mongoose.Schema;

const postSchema=new mongoose.Schema({
    description:{
        type:String
    },
    postImg:{
        data:Buffer,
        contentType:String
    },
    user:{
        type:ObjectId,
        ref:"User"
    },
    likes:{
       type:Array
    },
    comments:{
        type:Array
    }
},{timestamps:true})

module.exports=mongoose.model('Post',postSchema);