const express=require('express');
const router=express.Router();

const {createPost,updatePost,deletePost,getPost,getAllPosts,getUserTimelinePosts, likeDislike}=require('../Controllers/post');
const {isAuthenticated,isAuthorized}=require('../Middlewares/auth');
const getPostById=require('../Middlewares/post');
const getUserById=require('../Middlewares/user')

router.param('userId',getUserById);
router.param('postId',getPostById);

router.post('/post/create/:userId',isAuthenticated,isAuthorized,createPost);
router.put('/post/update/:userId/:postId',isAuthenticated,isAuthorized,updatePost);
router.delete('/post/delete/:userId/:postId',isAuthenticated,isAuthorized,deletePost);
router.get('/post/:userId/:postId',isAuthenticated,isAuthorized,getPost);
router.get('/posts/:userId',isAuthenticated,isAuthorized,getAllPosts);
router.get('/posts/userTimeline/:userId',isAuthenticated,getUserTimelinePosts);
router.put('/post/like/:userId/:postId',isAuthenticated,isAuthorized,likeDislike)


module.exports=router;