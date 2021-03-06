var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 9999;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.use(express.static(__dirname + '/public'));

    var date = new Date(),
        usernames = {},
        map = {
            "&lt;3": "\u2764\uFE0F",
            "&lt;/3": "\uD83D\uDC94",
            ":D": "\uD83D\uDE00",
            ":)": "\uD83D\uDE03",
            ";)": "\uD83D\uDE09",
            ":(": "\uD83D\uDE12",
            ":p": "\uD83D\uDE1B",
            ";p": "\uD83D\uDE1C",
            ":'(": "\uD83D\uDE22",
        };

    function esc_message(text) {
        var text = text;
        Object.keys(map).forEach(function (ico) {
            // escape special characters for regex
            var icoE = ico.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
            // now replace actual symbols
            text = text.replace(new RegExp(icoE, 'g'), map[ico]);
        });

        return text;
    }


    function escapeHTML(text) {
        return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    io.sockets.on('connection', function(socket){

    	socket.on('admitUser', function(username){
    		socket.username = username;
    		usernames[username] = username;
            console.log('username'+username); 
            io.emit('message', {
                    username: "Staggerit",
                    message: "<small><u><b>"+username+"</b> Joined the conversation</u></small>",
                    date: '',
            });
    	});
        
        
        console.log('a user connected ');
        
        socket.on('disconnect', function(e){
            console.log('user disconnected');
        });

        //show message in console.
        socket.on('message', function(data){
           
            console.log('message:'+data );
           
        });

        //Send & receive messages from clients 
        socket.on('message', function(data){ 
            var currentdate = new Date(),
                text = escapeHTML(data),
                res =  esc_message(text) ,
                datetime =  currentdate.getDate() + "/"+(currentdate.getMonth()+1)+","+currentdate.getHours()+":"+currentdate.getMinutes(); 
            io.emit('message', {
                username: socket.username,
                message: res,
                date: datetime,
            });
        });

});


