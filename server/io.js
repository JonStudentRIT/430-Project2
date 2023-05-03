const http = require('http');
const { Server } = require('socket.io');
// local socker variable
let io;
// information to output to mongo and the page
const handleChatMessage = (msg) => {
    io.emit(msg.channel, msg.message);
};
// create the server
const socketSetup = (app) => {

    const server = http.createServer(app);
    io = new Server(server);

    io.on('connection', (socket) => {
        socket.on('post list', handleChatMessage);
    });

    return server;
};

module.exports = socketSetup;