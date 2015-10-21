var express = require('express')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static('static'))

var messages = []

io.on('connection', function (socket) {
  console.log('New connection, resending messages')

  messages.forEach(function (e) {
    socket.emit('chat message', e)
  })

  socket.on('disconnect', function () {
    console.log('User disconnected')
  })

  socket.on('chat message', function (msg) {
    msg.time = Date.now()
    console.log('message: [' + msg.user + '] ' + msg.text)
    messages.push(msg)

    io.emit('chat message', msg)
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
