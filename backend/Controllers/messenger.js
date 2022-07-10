const Conversation = require('../Models/conversation');
const Message = require('../Models/message');
const { ObjectId } = require('mongodb');


//create new conversation id
const createConversationId=(req,res)=>{
    Conversation.findOne({ members: { $all: [req.body.userId, req.body.friendId] } })
    .then((convo) => {
        if (convo) {
            return res.status(200).json({
              msg:'conversation id already exists'
            })
        } else {
            const convo = new Conversation({ members: [req.body.userId, req.body.friendId] });
            convo.save({ new: true }, (err, convoDetails) => {
                if (err || !convoDetails) {
                    return res.status(400).json({
                        err: 'unable to create new conversation'
                    })
                }
                return res.status(200).json(convoDetails);
            })
        }
    }).catch((err) => console.log(err))
}


//get conversation id
const getConversationId = (req, res) => {
    console.log(req.params);
    Conversation.findOne({members:{ "$all" : [req.params.userId, req.params.friendId]} })
        .then((convo) => {
            if(convo) {
                console.log(convo);
                return res.status(200).json(convo)
            } else {
               return res.status(200).json({
                   err:'no conversation id exists for these users'
               })
            }
        }).catch((err) => console.log(err))
}


//create messages
const createMessage = (req, res) => {
    
    const msg = new Message(req.body);
    msg.save({ new: true }, (err, message) => {
        if (err || !message) {
            return res.status(400).json({
                err: "message not created"
            })
        } else {
            return res.status(200).json(message)
        }
    })
}



//get messages
const getMessages = (req, res) => {
    const convoId = ObjectId(req.params.convoId);
    console.log(typeof(convoId));
    Message.find({ conversationId:convoId }).then((messages) => {
        if (messages.length > 0) {
            return res.status(200).json(messages)
        } else {
            return res.status(200).json({
                msg: 'No messages found. Start New Conversation'
            })
        }
    }).catch((err) => console.log(err))
}

module.exports = { createConversationId,getConversationId, createMessage, getMessages };