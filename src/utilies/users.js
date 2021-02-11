 const users=[]


//Add User

const addUser= ({id,username,room})=>{
//Clean the data
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()

//Validate the Data!
if(!username || !room)
{
return {error:'username and rom are required'}

}

//Check for excisting user
const excistingUser=users.find((user)=>{

    return user.room === room && user.username === username
})

//Validate username
if(excistingUser)
{
    return{
        error: 'username is in use '
    }
}


//Store User
const user ={id,username,room}

users.push(user)

return{user}
}

const getUser=(id)=>{

   return users.find((user)=> user.id===id)

    
}

const getUsersInRoom=(room)=>{
   return users.filter((rooms)=>rooms.room===room);
}

const removeUser=(id)=>{

    const index= users.findIndex((user)=> user.id===id)

    if(index !== -1)
    {
        return users.splice(index,1)[0]
    }
}






console.log(users) 


module.exports={
    addUser,
    getUser,
    getUsersInRoom,
    removeUser

    }