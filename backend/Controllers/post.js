const Post = require('../Models/post');
const { create } = require('../Models/user');
const User = require('../Models/user');
const fs = require('fs');
const { IncomingForm } = require('formidable');
const post = require('../Models/post');

//create post
const createPost = (req, res) => {
    const form = new IncomingForm({ maxFileSize: 2 * 1024 * 1024 });
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: "Problem in uploading image"
            });
        }
        let newPost = new Post(fields);
        newPost.user = req.profile._id;
    
        if (files.postImg) {
            newPost.postImg.data = fs.readFileSync(files.postImg.filepath)
            newPost.postImg.contentType = files.postImg.mimetype;
        }
       
        newPost.save((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    err: "unable to save post"
                })
            }
            return res.status(200).json(post)
        })
    });
}


//update post
const updatePost = (req, res) => {
    const form = new IncomingForm({ maxFileSize: 2 * 1024 * 1024,keepExtensions:true });

    if (!req.profile._id.equals(req.post.user._id)) {
        return res.status(400).json({
            err: "you cannot edit others post"
        })
    }
    const oldPost=req.post;
    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                err: "Problem in updating image"
            });
        }
        oldPost.update({$set:{fields}});
        if (files.postImg) {
            oldPost.postImg.data = fs.readFileSync(files.postImg.filepath)
            oldPost.postImg.contentType = files.postImg.mimetype;
        }
       
        oldPost.save((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    err: "unable to save post"
                })
            }
            return res.status(200).json(post)
        })
    });

    // Post.findByIdAndUpdate(req.post._id, { $set: req.body }, { new: true }, (err, updatedPost) => {
    //     if (err || !updatedPost) {
    //         return res.status(400).json({
    //             err: "unable to edit post"
    //         })
    //     }
    //     return res.status(200).json(updatedPost)
    // })
}

//delete post
const deletePost = (req, res) => {
    if (!(req.profile._id.equals(req.post.user._id))) {
        return res.status(400).json({
            err: "you cannot delete others post"
        })
    }
    Post.findByIdAndDelete(req.post._id, (err, post) => {
        if (err || !post) {
            return res.status(400).json({
                err: "unable to delete post"
            })
        }
        return res.status(200).json({
            msg: "deleted this post successfully"
        })
    })
}

//get post when post id is given
const getPost = (req, res) => {
    return res.status(200).json(req.post);
}

//get all posts of user and user-following friends posts.
const getAllPosts = (req, res) => {

    Post.find().populate('user', '_id profilePhoto userName')
        .sort({createdAt:-1})
        .exec((err, posts) => {
            if (err || !posts) {
                res.status(400).json({
                    err: 'unable to get posts'
                })
            }
            const reqPosts = [];
            const followList = req.profile.following;
            posts && posts.map((item) => {
                if (followList.includes(item.user._id) || item.user._id.equals(req.profile._id)) {
                    reqPosts.push(item);
                }
            })
            res.status(200).json(reqPosts);
        })
}

//get user posts only
const getUserTimelinePosts=(req,res)=>{
    Post.find().populate('user', '_id profilePhoto userName')
    .sort({createdAt:-1})
    .exec((err, posts) => {
        if (err || !posts) {
            res.status(400).json({
                err: 'unable to get posts'
            })
        }
        const reqPosts = [];
        posts && posts.map((item) => {
            if (item.user._id.equals(req.profile._id)) {
                reqPosts.push(item);
            }
        })
        res.status(200).json(reqPosts);
    })
}

//like and dislike
const likeDislike=(req,res)=>{
  User.findById(req.post.user._id).exec((err,user)=>{
      if(err || !user){
          return res.status(400).json({err:"Unable to find post's owner"})
      }

      const post=req.post;
      post.likes.includes(req.profile._id)?(post.likes.pull(req.profile._id))
      :(post.likes.push(req.profile._id))

      post.save((err,i)=>{
          if(err || !i){
              return res.status(200).json({err:'unable to save'})
          }
          return res.status(400).json(i)
      })
  })
}

module.exports = { createPost, updatePost, deletePost, getPost, getAllPosts,getUserTimelinePosts,likeDislike};
