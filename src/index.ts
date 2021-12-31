import * as express from "express";
import {createServer} from "http";

const index = express();

const httpServer = createServer(index);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3001"
    }
});

const games = [];

io.on("connection", (socket) => {
    socket.on('createGame', (gameName) => {

        if (games.indexOf(gameName) > -1) {
            socket.send('Unable to create the game as it already exists, joining instead');
            socket.join(gameName)
        }
        games.push(gameName);
        socket.join(gameName);
        io.to('Game1').emit('message', `Socket ${socket.id} has joined the fray`)
        console.log(games)
    })
    socket.on('joinGame', (gameName: string) => {
        console.log('Rooms: ', io.sockets.adapter.rooms)
        console.log('A request arrived to join game: ', gameName);
        console.log(games.indexOf(gameName), typeof gameName)
        console.log('Testing equality: ', games[0], gameName)
        if (games.indexOf(gameName) > -1) {
            socket.join(gameName);
        } else {
            throw Error('Game not found')
        }
        socket.to('Game1').emit('message', `Socket ${socket.id} has joined the fray`)
    })
});


// handle the event sent with socket.send()
io.on("message", data => {
    console.log('data: ', data);
});

httpServer.listen(3005, () => console.log('Listening on port 3005'));

