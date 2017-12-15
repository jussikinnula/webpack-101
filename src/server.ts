import * as path from 'path';
import * as moment from 'moment';
import * as express from 'express';
import * as SocketIO from 'socket.io';
import * as serveStatic from 'serve-static';

// Message interface
import { IMessage } from './message.interface';

// Environment
const PORT = process.env.PORT || 5000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DYNO_NAME = process.env.PS || process.env.DYNO || `local.${PORT}`;

// ExpressJS app
const app = express();

// Serve static files
app.use('/assets', serveStatic(path.join(__dirname, '../target/assets')));

// All other routes are handled by spa
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../target/index.html')));

// Server
const server = app.listen(PORT).on('listening', () => {
  console.log(`Listening on: http://localhost:${server.address().port}`);
});

// Socket.io connection
const io = SocketIO(server);
const adapter = require('socket.io-redis');
io.adapter(adapter(REDIS_URL));
io.on('connection', (socket) => {
  console.log('Client connected');

  // Relay all received messages
  socket.on('chat message', (msg: IMessage) => {
    const dyno = DYNO_NAME;
    const time = moment().format('LTS');
    const nick = (msg.nick && msg.nick !== '') ? msg.nick : 'Unnamed';
    const message = msg.message;
    console.log(`Received message: "${message}" from "${nick}"`);
    io.sockets.emit('chat message', { dyno, time, nick, message });
  });
});
