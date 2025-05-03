const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require("node:path");
const Queue = require("./serverLogic/queue.js");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let waitingClients = Queue;

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('start-call', () => {
        if (waitingClients.size() < 1) {
            waitingClients.push(socket);
            socket.emit('waiting');
        } else {
            const pair = waitingClients.pairClients();
            if (!pair) {
                waitingClients.push(socket);
                socket.emit('waiting');
                return;
            }
            const { offer, answer } = pair;
    
            offer.emit('ready-to-call', { type: 'offer' });
            answer.emit('ready-to-call', { type: 'answer' });
    
            offer.otherPeer = answer;
            answer.otherPeer = offer;
        }
    });
    

    socket.on('ice-candidate', (candidate) => {
        if (socket.otherPeer) {
            socket.otherPeer.emit('ice-candidate', candidate);
        }
    });

    socket.on('offer', (offer) => {
        if (socket.otherPeer) {
            socket.otherPeer.emit('offer', offer);
        }
    });

    socket.on('answer', (answer) => {
        if (socket.otherPeer) {
            socket.otherPeer.emit('answer', answer);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        if (socket.otherPeer) {
            socket.otherPeer.emit('call-ended');
            socket.otherPeer.otherPeer = null;
        }
    
        waitingClients.removeClient(socket);
    });
    
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT =  3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});