var socket = io()

var renderedIds = [] // A list of UUIDs which have been rendered
var userName = undefined

function updateTime () {
  var dateLis = $('#messages li span.time')

  dateLis.each(function () {
    var e = $(this)
    e.text(renderTime(parseInt(e.attr('data-time'), 10)))
  })
}

setInterval(updateTime, 5000)

function renderTime (time) {
  return moment(time).fromNow()
}

function renderMsg (msg) {
  if (!(msg.id in renderedIds)) {
    $('#messages').append(
      $('<li>')
        .attr('id', msg.id)
        .append(
          $('<b class="name">').text(msg.user)
        )
        .append(
          $('<span class="text">').text(msg.text)
        )
        .append(
          $('<span class="time">').attr('data-time', msg.time)
        )
    )

    updateTime()

    var element = $('body')
    element.scrollTop(element[0].scrollHeight)

    renderedIds.push(msg.id)
  } else {
    console.log('Duplicate message', msg)
  }
}

function setName(name) {
  socket.emit('set name', name)
  $('#username').text('Chatting as ' + name)
  username = name
  Cookies.set('chatname', name, { expires: 7})
}

function getName() {
  return username
}

$('form').submit(function () {
  var msg = {text: $('#m').val()}

  socket.emit('chat message', msg)
  $('#m').val('')
  return false
})

$('#uname').change(function () {
  socket.emit('set name', $('#uname').val())
})

$('#username').click(function () {
  var newName = prompt("Enter your new name: ", getName())

  if (newName) {
    setName(newName)
  }
})

$(function() {
  var name = Cookies.get('chatname')

  if(name) {
    setName(name)
  }
})

socket.on('chat message', function (msg) {
  renderMsg(msg)
})

socket.on('user list', function(list){
  console.log(list)
})
