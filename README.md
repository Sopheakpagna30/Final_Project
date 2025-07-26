# Real-time Chat Application

A full-stack real-time chat application built with React, Node.js, Express, MongoDB, and Socket.io.

## Project Structure

```
├── client/          # React frontend application
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── server-app/      # Node.js backend application
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation & Setup

1. **Install Client Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Install Server Dependencies**
   ```bash
   cd server-app
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `server-app` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:3000
   PORT=5000
   ```

4. **Start MongoDB**
   
   Make sure MongoDB is running on your system.

### Running the Application

You need to run both the client and server separately:

1. **Start the Server** (Terminal 1)
   ```bash
   cd server-app
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start the Client** (Terminal 2)
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:3000

## Features

- **Real-time messaging** with Socket.io
- **User authentication** (register/login)
- **Online user status**
- **Typing indicators**
- **Group conversations**
- **Message history**
- **Responsive design**
- **Dark mode support**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Messages
- `GET /api/messages/conversations` - Get user conversations
- `POST /api/messages/conversations` - Create new conversation
- `GET /api/messages/conversations/:id` - Get conversation messages
- `POST /api/messages/conversations/:id` - Send message

## Socket Events

### Client to Server
- `joinConversation` - Join a conversation room
- `leaveConversation` - Leave a conversation room
- `sendMessage` - Send a message
- `typing` - Send typing indicator

### Server to Client
- `onlineUsers` - List of online users
- `newMessage` - New message received
- `userTyping` - User typing indicator

## Technologies Used

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Socket.io Client
- Vite
- Lucide React (icons)

### Backend
- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Development

### Client Development
```bash
cd client
npm run dev    # Start development server
npm run build  # Build for production
```

### Server Development
```bash
cd server-app
npm run dev    # Start with nodemon (auto-restart)
npm start      # Start production server
```