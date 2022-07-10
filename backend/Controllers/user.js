const User = require('../Models/user')
const {IncomingForm} =require('formidable');
const fs=require('fs');
const { json } = require('express/lib/response');

//----------------------get only user--------------------------------
const getUser = (req, res) => {
    return res.status(200).json(req.profile);
}

//------------------get user populated with friends---------------------------
const getUserP = (req, res) => {
    User.findById(req.profile._id)
        .populate('followers', '_id userName profilePhoto')
        .populate('following', '_id userName profilePhoto')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    err: "unable to find the user"
                })
            }
            user.password = undefined;
            res.status(200).json(user)
        })
}


//-------------------------------get Users to follow --------------------------------------

const getUsers=(req,res)=>{
    User.find().exec((err,users)=>{
        if(err || !users){
            res.status(400).json({err:'unable to get users'})
        }
        const user=req.profile;
        const reqdata=[];
        users && users.map((i)=>{
           i.password=undefined; 
          (user.following.includes(i._id) || user._id.equals(i._id))?'':reqdata.push(i)
        })
        res.status(200).json(reqdata);
    })
}

//------------------------------------------update user---------------------------------------
const updateUser = (req, res) => {
    const form = new IncomingForm({ maxFileSize: 2 * 1024 * 1024, keepExtensions: true });
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: "Problem in updating image"
            });
        } 
        const user =req.profile;
        if(fields.userName){
            user.userName=fields.userName
        }
        if(fields.from){
            user.from=fields.from
        }
        if(fields.livesIn){
            user.livesIn=fields.livesIn
        }
        if(fields.relationship){
            user.relationship=fields.relationship
        }
        if(fields.dob){
            user.dob=fields.dob
        }
        if (files.profilePhoto) {
            user.profilePhoto.data = fs.readFileSync(files.profilePhoto.filepath)
            user.profilePhoto.contentType = files.profilePhoto.mimetype;
        }
        if (files.coverPhoto) {
            user.coverPhoto.data = fs.readFileSync(files.coverPhoto.filepath)
            user.coverPhoto.contentType = files.coverPhoto.mimetype;
        }
       
        user.save((err,item) => {
            if (err || !item) {
                console.log(err);
                return res.status(400).json({
                    err: "unable to save user Info"
                })
            }
            return res.status(200).json(item)
        })    
    })

}

//------------------------------delete user-----------------------------------
const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.profile._id, (err, user) => {
        if (err || !user) {
            res.status(400).json({
                err: "unable to delete user"
            })
        }
        res.status(200).json({
            msg: 'user deleted successfully'
        })
    })
}


//-------------------------------follow user---------------------------------
const follow = (req, res) => {
    const currentUser = req.profile;
    User.findById(req.body.userId)
        .then((userToFollow) => {
            if (!(currentUser.following.includes(req.body.userId))) {

                currentUser.following.push(userToFollow._id);
                currentUser.save((err,user)=>{
                    if(err)console.log(err);
                })
                userToFollow.followers.push(currentUser._id);
                userToFollow.save((err,user)=>{
                    if(err)console.log(err);
                })

                // currentUser.updateOne({ $push: { following: userToFollow._id } })
                //     .catch(err => console.log(err))
                // userToFollow.updateOne({ $push: { followers: currentUser._id } })
                //     .catch(err => console.log(err))

                return res.status(400).json({
                    msg: "following"
                })
            } else {
                return res.status(400).json({
                    msg: "Already following this user"
                })
            }
        }).catch((err) => {
            return res.status(400).json({
                err: "unable to find the user to follow"
            })
        })
}


//---------------------------------unfollow a user-----------------------------------------
const unfollow = (req, res) => {
    const currentUser = req.profile;
    User.findById(req.body.userId)
        .then((userToUnfollow) => {
            if (currentUser.following.includes(req.body.userId)) {
                console.log('hi');
                currentUser.following.pull(userToUnfollow._id);
                currentUser.save((err,user)=>{
                    if(err)console.log(err);
                })
                userToUnfollow.followers.push(currentUser._id);
                userToUnfollow.save((err,user)=>{
                    if(err)console.log(err);
                })

                // currentUser.updateOne({ $pull: { following: userToUnfollow._id } })
                //     .catch(err => console.log(err))
                // userToUnfollow.updateOne({ $pull: { followers: currentUser._id } })
                //     .catch(err => console.log(err))
                return res.status(400).json({
                    msg: "unfollow successfull"
                })
            } else {
                return res.status(400).json({
                    err: "Your are not following this user"
                })
            }
        }).catch((err) => {
            return res.status(400).json({
                err: "unable to find the user"
            })
        })
}


module.exports = { getUser, getUserP,getUsers, updateUser, deleteUser, follow, unfollow };