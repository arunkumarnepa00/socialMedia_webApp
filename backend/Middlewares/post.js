const Post=require('../Models/post')

const getPostById=(req,res,next,id)=>{
    
Post.findById(id).populate('user','_id userName email profilePhoto coverPhoto livesIn city dob relationship').exec((err,post)=>{
    if(err || !post){
        return res.status(400).json({
            err:"unable to find the post"
        })
    }
    req.post=post;
    //console.log(req.post);
    next();
})
}

module.exports=getPostById;