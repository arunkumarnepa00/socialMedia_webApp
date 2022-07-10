const router=require('express').Router();
const {isAuthenticated,isAuthorized}=require('../Middlewares/auth');
const getUserById=require('../Middlewares/user');
const {createConversationId,getConversationId,createMessage,getMessages}=require('../Controllers/messenger');

router.param('userId',getUserById);
router.get('/messenger/conversationId/:userId/:friendId',isAuthenticated,isAuthorized,getConversationId)
router.post('/messenger/create/conversationId/:userId',isAuthenticated,isAuthorized,createConversationId)
router.post('/message/create/:userId',isAuthenticated,isAuthorized,createMessage)
router.get('/messages/:userId/:convoId',isAuthenticated,isAuthorized,getMessages)

module.exports=router;

