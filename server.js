const
    express = require("express"),
    socket  = require("socket.io"),
    http    = require("http"),
    path    = require("path"),
    route   = require("./route"),
    app     = express(),
    server  = http.createServer(app),
    io      = socket(server);

app.set('view engine', 'pug');
app.set('views', path.join('./static/views'));


app.use("/css", express.static('./static/css') );
app.use('/js', express.static('./static/js') );

app.use('/', route);

io.sockets.on('connection', socket => {
    console.log('user connect');

    socket.on('newUser', name => {
        console.log(name + ' Connect On');

        //소켓에 이름 저장;
        socket.name = name;

        //모든 소켓에게 전송
        io.sockets.emit('update', { type: 'connect', name: 'SERVER', message: name + 'Connect On' });
    });

    socket.on('message', data => {
        
        //받은 데이터에 누가 보냈는지 이름을 추가
        data.name = socket.name;
        
        console.log(data);

        socket.broadcast.emit('update', data);
    })

    socket.on('disconnect', () => {
        console.log(socket.name + ' DisConnect');

        socket.broadcast.emit('update', { type: 'disconnect', name: 'SERVER', message: socket.name + ' Disconnect' });
    });
} )

server.listen(8080, () => {
    console.log("Server On!");
});



