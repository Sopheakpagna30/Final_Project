import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import { authenticateSocket } from './middleware/auth.js';
import userRoutes from './routes/user.js';
dotenv.config();

const app = express();
app.use('/api/users', userRoutes);
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Socket.io connection handling
const onlineUsers = new Map();

io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('User connected:', socket.user.username);
  
  // Add user to online users
  onlineUsers.set(socket.user._id.toString(), {
    id: socket.user._id,
    username: socket.user.username,
    socketId: socket.id
  });

  // Broadcast updated online users list
  io.emit('onlineUsers', Array.from(onlineUsers.values()));

  // Join user to their rooms
  socket.join(socket.user._id.toString());

  // Handle joining a conversation
  socket.on('joinConversation', (conversationId) => {
    socket.join(conversationId);
    console.log(`${socket.user.username} joined conversation: ${conversationId}`);
  });

  // Handle leaving a conversation
  socket.on('leaveConversation', (conversationId) => {
    socket.leave(conversationId);
    console.log(`${socket.user.username} left conversation: ${conversationId}`);
  });

  // Handle sending messages
  socket.on('sendMessage', (messageData) => {
    // Broadcast to conversation room
    socket.to(messageData.conversationId).emit('newMessage', {
      ...messageData,
      sender: {
        _id: socket.user._id,
        username: socket.user.username
      },
      timestamp: new Date()
    });
  });

  // Handle typing indicators
  socket.on('typing', (data) => {
    socket.to(data.conversationId).emit('userTyping', {
      userId: socket.user._id,
      username: socket.user.username,
      isTyping: data.isTyping
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);
    onlineUsers.delete(socket.user._id.toString());
    io.emit('onlineUsers', Array.from(onlineUsers.values()));
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});