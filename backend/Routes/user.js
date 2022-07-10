const express=require('express');
const router=express.Router();

const getUserById=require('../Middlewares/user')
const {getUser,getUserP,getUsers,updateUser,deleteUser,follow,unfollow}=require('../Controllers/user')
const {isAuthenticated,isAuthorized}=require('../Middlewares/auth')


router.param('userId',getUserById);
router.get('/user/:userId',isAuthenticated,getUser);
router.get('/userp/:userId',isAuthenticated,getUserP);
router.get('/users/:userId',isAuthenticated,isAuthorized,getUsers);
router.put('/user/:userId',isAuthenticated,isAuthorized,updateUser)
router.delete('/user/:userId',isAuthenticated,isAuthorized,deleteUser)
router.put('/user/follow/:userId',isAuthenticated,isAuthorized,follow)
router.put('/user/unfollow/:userId',isAuthenticated,isAuthorized,unfollow)


module.exports=router;