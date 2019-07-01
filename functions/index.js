const functions = require("firebase-functions")
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/test', function(req, res){
	res.send('<h1>Hi! I\'m the socket.io frontend page don\'t look at me!');
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(socket){
	console.log('User: ' + socket.id + ' has connected');
	socket.on('PLAYING', function(data){
		console.log('Player just started');
	});
	socket.on('PAUSED', function(data) {
		console.log('Player just paused');
	});
});

exports.app = functions.https.onRequest(app);

