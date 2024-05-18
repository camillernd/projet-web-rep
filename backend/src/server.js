const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const socketIo = require('socket.io');

const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const celebRoutes = require('./routes/celebRoutes');
const discussionRoutes = require('./routes/discussionRoutes');
const messageRoutes = require('./routes/messageRoutes');
const likeRoutes = require('./routes/likeRoutes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Configuration CORS pour Express
app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/movie', movieRoutes);
app.use('/api/celeb', celebRoutes);
app.use('/api/discussion', discussionRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/like', likeRoutes);

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createDiscussion', (discussion) => {
    io.emit('discussionCreated', discussion);
  });

  socket.on('deleteDiscussion', (discussionId) => {
    io.emit('discussionDeleted', discussionId);
  });

  socket.on('createMessage', (message) => {
    io.emit('messageCreated', message);
  });

  socket.on('deleteMessage', (messageId) => {
    io.emit('messageDeleted', messageId);
  });

  socket.on('likeMessage', (likeInfo) => {
    io.emit('messageLiked', likeInfo);
  });

  socket.on('unlikeMessage', (likeInfo) => {
    io.emit('messageUnliked', likeInfo);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log('Server is running on PORT', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB...', err);
  });
