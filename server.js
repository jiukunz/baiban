var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');

var app = express()
    , http = require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , fs = require('fs')


app.set('port', process.env.PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/baiban');

var Room = mongoose.model('Room', { name: String, data: String });

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


io.sockets.on('connection', function (socket) {

    socket.on('join room', function (roomName) {
        socket.set('room', roomName, function () {
            console.log('RoomName: ' + roomName + ' Opened');
        });
        socket.join(roomName);
        Room.findOne({name: roomName}, function (err, room) {
            if (!err) {
                if (room) {
                    io.sockets.in(roomName).emit('update', room.data);
                }
            }
        });

    });

    socket.on('commit', function (message) {
        io.sockets.in(message.room).emit('update', message.data);
    });

    socket.on('saveMessage', function (message) {
        Room.findOne({name: message.roomName}, function (err, room) {
            if (!err) {
                if (!room) {
                    room = new Room();
                    room.name = message.roomName;
                }
                room.data = message.data;
                room.save();
            }
        });
    });
});
// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }


app.get('/', function (req, res) {
    res.render('index', { title: 'Express' });
});

app.get('/:roomName', function (req, res) {
    res.render('room', { roomName: req.params.roomName });
});

