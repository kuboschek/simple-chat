var socket = io()

var renderedIds = [] // A list of UUIDs which have been rendered

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

$('form').submit(function () {
  var msg = {text: $('#m').val()}

  socket.emit('chat message', msg)
  $('#m').val('')
  return false
})

$('#uname').change(function () {
  socket.emit('set name', $('#uname').val())
})


socket.on('chat message', function (msg) {
  renderMsg(msg)
})

socket.on('user list', function(list){
  console.log(list)
})
