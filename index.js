var express = require('express')
var app = express()

var http = require('http').Server(app)
var io = require('socket.io')(http)

var uuid = require('uuid')

app.use(express.static('static'))

var messages = []
var users = []

io.on('connection', function (socket) {
  // console.log('New connection, resending messages')

  // Resend all old messages
  messages.forEach(function (e) {
    socket.emit('chat message', e)
  })

  var myuser = {'name': undefined, 'socket': socket.id}
  users.push(myuser)

  socket.on('disconnect', function () {
    users = users.filter(function (e) {
      return e.socket !== socket.id
    })

    sendUsers()
  })

  socket.on('chat message', function (msg) {
    msg.user = getUname(socket)

    if (!msg.user) return
    if (!msg.text) return

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
    sendUsers()
  })

  function sendUsers () {
    io.emit('user list', users.map(function (e) {
      return e.name
    }))
  }

  function getUname (socket) {
    return (users.filter(function (e) {
      return e.socket === socket.id
    })[0].name)
  }
})

http.listen(3000, function () {
  console.log('listening on *:3000')
})
