const socket= io()


//Elements

const $msgsend=document.getElementById("btn")
const $msginput=document.getElementById("msg")
const $msgloc= document.querySelector("#location")
const $msgs = document.querySelector("#msgs")

//End of elements selectors

//Templeates
const msgTempleates= document.querySelector("#msg-template").innerHTML
const loctemplate= document.querySelector("#loc-template").innerHTML
const sidebarTemplate=document.querySelector("#sidebar-template").innerHTML

//End of Templates


//Options
const{username,room}=Qs.parse(location.search , {ignoreQueryPrefix:true})
//end of options


const autoScroll = ()=>{
    //new message 
    const newmsg=$msgs.lastElementChild

    //Height of the new message
    const newmsgsStyles=getComputedStyle(newmsg)
    const newmsgMargin=parseInt(newmsgsStyles.marginBottom)
    const newmsgHeight =newmsg.offsetHeight+newmsgMargin


    //Visible height ,,what can be seen through the screen

    const visibleHeight=$msgs.offsetHeight

    //Height of message container (All)
    const containerHeight=$msgs.scrollHeight

    //How far have i scrollled
    const scrlloffSet=$msgs.scrollTop+visibleHeight // The imount of distance i scrolled from the top + visible will equal how far from the new message (bottom).
if(containerHeight-newmsgHeight <= scrlloffSet)
{
    $msgs.scrollTop=$msgs.scrollHeight
}

    console.log(newmsgMargin)
}



//New messages
socket.on('newUser',(wlx)=>{

    console.log(wlx)
    
    const html = Mustache.render(msgTempleates,
        {
          username:  wlx.username,
            wlx : wlx.text,
            createdAt:moment(wlx.createdAt).format('h:mm a') 
        })
    $msgs.insertAdjacentHTML('beforeend',html)

    autoScroll()
    })



    socket.on('userData',({room,users})=>{
       const html= Mustache.render(sidebarTemplate,{
           room,
           users
       })
       document.getElementById('sidebar')
       .innerHTML=html
    })

//Share url location
    socket.on('locationshared',(location)=>{
        console.log(location)
    
        const html = Mustache.render(loctemplate,{
            username:location.username,
            location:location.url,
           createdAt: moment(location.createdAt).format('h:mm a')

        })
        $msgs.insertAdjacentHTML('beforeend',html)

        autoScroll()
        })




$msgsend.addEventListener('click', (e)=>{
e.preventDefault()
$msgsend.setAttribute('disabled','disabled')

var msgbody = $msginput.value

socket.emit('msgbody',msgbody, (error)=>{
    $msgsend.removeAttribute('disabled')
    $msginput.value=''
    $msginput.focus()
    if(error)
    {
        return console.log(error)
    }
    console.log('message was delivered!')
     
  
})

})

$msgloc.addEventListener('click',()=>{
if(!navigator.geolocation)
{
    return ('Grolocation isnt supported')
}
$msgloc.setAttribute('disabled','disabled')

navigator.geolocation.getCurrentPosition((position)=>{
//console.log(position)

socket.emit('location',(
    `https://www.google.com/maps?q=${position.coords.latitude},${position.coords.longitude}`)
    ,
    ()=>{

        

        console.log('location shared')
        $msgloc.removeAttribute('disabled')
    }
    
    )

}
)

})
socket.emit('join',{username,room},(error)=>{

    if(error)
   {
       location.href="/"
       alert (error)
   }
})


