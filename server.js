var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

var port = process.env.PORT || 8080
app.listen(port);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

// io.sockets.on('commit', function (socket) {
//   console.log(socket);
//   socket.emit('update', { message: socket.data});
// });


// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

io.sockets.on('connection', function (socket) {

  socket.on('commit', function (message){
    console.log(message.data);
    socket.broadcast.emit('update', message.data);  
  });
  
});


