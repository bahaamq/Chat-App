const express= require('express')
const app = express()
const http = require('http')
const server=http.createServer(app)
const socket = require('socket.io')
const io=socket(server)
const {generateMessage,generatelocationmessage}=require('./src/utilies/messages')
const { addUser, getUser, getUsersInRoom,removeUser}=require('./src/utilies/users')
const path=require('path')
const dir =path.join(__dirname,'./Public')
app.use(express.static(dir))
const Filter = require('bad-words')
let count = 0 
io.on('connection', (socket) => {

    console.log('a user connected')



    socket.on('join',({username,room} , callback) =>{

const {error, user}=addUser({id:socket.id,username,room})


if(error)
{
    return callback(error)
}
        socket.join(user.room)

        socket.emit('newUser',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('newUser' , generateMessage('Admin :', `${user.username} has joined!`))
       io.to(user.room).emit('userData',{
           room:user.room,
           users: getUsersInRoom(user.room)
       })

        callback()
    })



socket.on('msgbody',(msg,callback)=>{
    //console.log(msg)
    const user=getUser(socket.id)
    if(user)
    {
    const filter = new Filter();
if(filter.isProfane(msg))
{
    return callback('profiniity is not allowed')
}
   io.to(user.room).emit('newUser',generateMessage(user.username,msg))
   callback()
}})





socket.on('location' , (loc,callback)=>{

    const user=getUser(socket.id)
    if(user)
    {
    io.to(user.room).emit('locationshared' , generatelocationmessage(user.username,loc))
    callback()
    }
    })


socket.on('disconnect',()=>{

    const user=removeUser(socket.id)
    if(user)
    {
        io.to(user.room).emit('newUser', generateMessage(`${user.username} A user has left`))
    }
 

    io.to(user.room).emit('userData',{
        room:user.room,
        users: getUsersInRoom(user.room)
    })
})



  })

  server.listen(process.env.PORT || 3000 ,()=>{

    console.log('Running at Port 3000');

});

