const io = require("socket.io")(8001, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

let users = [];
const addUserId = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId != socketId)
}
const getUser = (userId) => {
   return users.find(user =>user.userId === userId)
}

io.on("connection", socket => {

    //connection
    console.log('user connected');
    io.emit('welcome', 'welcome to socket io server')

    //add user to list
    socket.on('addUser', (userId) => {
        addUserId(userId, socket.id)
    })
    //emit users
    io.emit('getUsers', users)
    //add message
    socket.on("sendMsg", (data) => {
        const { userId, friendId, text } = data;
        const receiver=users.find(user=>user.userId===friendId)
        io.to(receiver.socketId).emit('getMsg', { userId, friendId, text })
    })

    //disconnection
    socket.on("disconnect", () => {
        removeUser(socket.id)
        console.log('user disconnected');
        io.emit('getUsers', users)
    })
})