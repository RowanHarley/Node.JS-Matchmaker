var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = [][];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
io.on('connection', function(socket){
	socket.on("adduser", function(user,score){
		socket.user = user;
		users.push(user);
		updateClients();
	});
	socket.on('ip', function (myip) {
		console.log('a user with ip', myip, 'connected.');
		console.log("Finding match for", myip, ".");
		var findMatch = require(".\src\FindMatch.js");
		findMatch.start(myip);
	});
	socket.on('disconnect', function(){
		for(var i = 0; i < users.length; i++){
			if(users[i] == socket.user){
				delete users[users[i]];
			}
		}
		updateClients();
		console.log('user disconnected');
	});
	function updateClients(){
		io.sockets.emit('update', users);
	}
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});