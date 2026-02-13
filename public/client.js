const socket = io()
let currentRoom = null
let username = null
function startChat(){
  username=document.getElementById("usernameInput").value
  if(username!==null and username!=""){
  d1=document.getElementById("chat-container-1")
  d1.style="display:none;"
  d2=document.getElementById("chat-container")
  d2.style="display:block;"
  socket.emit('setUsername', username)
  }
  else{
    err=document.getElementById("errorline")
    err.style.display="block"
  }
}

const form = document.getElementById('chat-form')
const input = document.getElementById('msg')
const messages = document.getElementById('messages')
let r1 = ""

function joinRoom(room) {
  if (currentRoom) socket.emit('leaveRoom', currentRoom)
  currentRoom = room
  r1 = room
  socket.emit('joinRoom', room)
  messages.innerHTML = ''
}

form.addEventListener('submit', e => {
  e.preventDefault()
  if (input.value && currentRoom) {
    socket.emit('chatMessage', { msg: input.value, room: currentRoom })
    input.value = ''
  }
})

input.addEventListener("input", () => {
  socket.emit("typing", currentRoom)  
})

socket.on("enter-message", msg => {
  const div = document.createElement('div')
  div.textContent = msg
  div.style = "color:white;"
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
})
let count=0
socket.on("typing", name => {
  
  if(count==0){
  count+=1
  const div = document.createElement('div')
  div.textContent = name+" is typing..."
  div.style = "color:white;"
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
  typingTimer = setTimeout(() => {
    count-=1
    div.remove()
  }, 3000);
  }
  
})

socket.on('message', ({ msg, name, time }) => {
  const div = document.createElement('div')
  div.style = `width:100%; display:flex; justify-content:${socket.id === name ? 'flex-end' : 'flex-start'};`

  const bubble = document.createElement('div')
  bubble.className = socket.id === name ? 'owner' : 'other'
  bubble.innerHTML = `${msg}<br><small style="font-size:10px;opacity:0.6">${time}</small>`

  div.appendChild(bubble)
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
})
