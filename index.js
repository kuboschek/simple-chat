var express = require('express')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

var uuid = require('node-uuid')

app.use(express.static('static'))

var messages = []
var users = []

io.on('connection', function (socket) {
  console.log('New connection, resending messages')

  messages.forEach(function (e) {
    socket.emit('chat message', e)
  })

  var myuser = {'name': undefined, 'socket': socket}
  users.push(myuser)

  socket.on('disconnect', function () {
    console.log('User disconnected')
  })

  socket.on('chat message', function (msg) {
    msg.time = Date.now()

    if (!msg.id) {
      msg.id = uuid.v4()
    }

    console.log('name: ' + myuser.name)
    console.log('[' + msg.user + '] ' + msg.text)
    messages.push(msg)

    io.emit('chat message', msg)
  })

  socket.on('set name', function (msg) {
    myuser.name = msg
    console.log('Set username to ' + msg)
  })
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
