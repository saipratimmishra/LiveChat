const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const moment = require('moment')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static('public'))

const users = {}

io.on('connection', socket => {
  console.log('User connected:', socket.id)

  socket.on('setUsername', username => {
    users[socket.id] = username
  })

  socket.on('joinRoom', room => {
    socket.join(room)
    const name = users[socket.id]
    io.to(room).emit('enter-message', `${name} joined ${room}`)
  })

  socket.on('leaveRoom', room => {
    socket.leave(room)
    const name = users[socket.id]
    io.to(room).emit('enter-message', `${name} left ${room}`)
  })

  socket.on('chatMessage', ({ msg, room }) => {
    const name = users[socket.id] || 'Anonymous'
    const timestamp = moment().utcOffset('+05:30').format('hh:mm A')
    io.to(room).emit('message', { msg: `${name}: ${msg}`, name: socket.id, time: timestamp })
  })

  socket.on('disconnect', () => {
    const name = users[socket.id] || 'Unknown'
    io.emit('enter-message', `${name} left the chat`)
    delete users[socket.id]
  })
})

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
