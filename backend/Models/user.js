const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const {ObjectId}=mongoose.Schema;

const userSchema = new mongoose.Schema({
    userName: {
        type: String
      
    },
    email: {
        type: String,
        unique:true
    },
    password: {
        type: String,
        
    },
    profilePhoto: {
        data: Buffer,
        contentType: String
    },
    coverPhoto: {
        data: Buffer,
        contentType: String
    },
    from: {
        type: String
    },
    livesIn:{
        type:String
    },
    relationship:{
        type: String
    },
    dob:{
      type:String
    },
    following:[{
        type:ObjectId,
        ref:'User'
    }],
    followers:[{
        type:ObjectId,
        ref:'User'
    }],
    role: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

// userSchema.pre('save', function () {
//     this.password = bcrypt.hashSync(this.password, 10);
// })

userSchema.methods.hashpwd=function(enterPassword){
    this.password = bcrypt.hashSync(enterPassword, 10);
}
userSchema.methods.authenticate = function (enterPassword) {
    return bcrypt.compareSync(enterPassword, this.password);
}
module.exports = mongoose.model('User', userSchema);