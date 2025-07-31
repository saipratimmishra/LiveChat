const socket = io()
let currentRoom = null

const username = prompt('Enter your name:')
socket.emit('setUsername', username)

const form = document.getElementById('chat-form')
const input = document.getElementById('msg')
const messages = document.getElementById('messages')

function joinRoom(room) {
  if (currentRoom) socket.emit('leaveRoom', currentRoom)
  currentRoom = room
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

socket.on("enter-message", msg => {
  const div = document.createElement('div')
  div.textContent = msg
  div.style = "color:white;"
  messages.appendChild(div)
  messages.scrollTop = messages.scrollHeight
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
