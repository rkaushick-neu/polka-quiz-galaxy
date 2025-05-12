const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const os = require('os');

// Find local IP address
const getLocalIpAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
};

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store connected participants
const participants = new Map();
// Store quiz results
const results = new Map();
// Quiz state
let quizState = {
  inProgress: false,
  totalParticipants: 0,
  finishedParticipants: 0,
};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle participant registration
  socket.on('register', ({ name, walletAddress }) => {
    participants.set(socket.id, { id: socket.id, name, walletAddress, status: 'waiting' });
    quizState.totalParticipants = participants.size;
    
    console.log(`Participant registered: ${name} (${walletAddress})`);
    
    // Broadcast updated participants list to everyone
    io.emit('participants-updated', Array.from(participants.values()));
    io.emit('quiz-state-updated', quizState);
  });

  // Handle quiz start
  socket.on('start-quiz', () => {
    const participant = participants.get(socket.id);
    if (participant) {
      participant.status = 'in-progress';
      participants.set(socket.id, participant);
      
      // Update quiz state
      quizState.inProgress = true;
      io.emit('quiz-started');
      io.emit('participants-updated', Array.from(participants.values()));
      io.emit('quiz-state-updated', quizState);
    }
  });

  // Handle quiz completion
  socket.on('quiz-completed', (result) => {
    const participant = participants.get(socket.id);
    if (participant) {
      participant.status = 'completed';
      participants.set(socket.id, participant);
      
      // Store quiz results
      results.set(socket.id, {
        ...result,
        name: participant.name,
        walletAddress: participant.walletAddress
      });

      // Update quiz state
      quizState.finishedParticipants++;
      
      // Check if all participants have finished
      if (quizState.finishedParticipants === quizState.totalParticipants) {
        // If everyone is done, broadcast results
        const allResults = Array.from(results.values())
          .sort((a, b) => b.score - a.score); // Sort by score descending
        
        io.emit('all-completed', allResults);
        
        // Reset quiz state for next round
        quizState = {
          inProgress: false,
          totalParticipants: participants.size,
          finishedParticipants: 0,
        };
      }
      
      // Broadcast updated state
      io.emit('participants-updated', Array.from(participants.values()));
      io.emit('quiz-state-updated', quizState);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (participants.has(socket.id)) {
      participants.delete(socket.id);
      results.delete(socket.id);
      
      // Update quiz state
      quizState.totalParticipants = participants.size;
      
      // Check if we need to adjust finished count
      if (quizState.finishedParticipants > quizState.totalParticipants) {
        quizState.finishedParticipants = quizState.totalParticipants;
      }
      
      // Broadcast updated participants list
      io.emit('participants-updated', Array.from(participants.values()));
      io.emit('quiz-state-updated', quizState);
    }
  });
});

// Endpoint to get server info
app.get('/server-info', (req, res) => {
  const localIp = getLocalIpAddress();
  res.json({ 
    ip: localIp, 
    port: process.env.PORT || 3001,
    participants: Array.from(participants.values()).length
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  console.log(`
  🚀 Server running!
  - Local:    http://localhost:${PORT}
  - Network:  http://${localIp}:${PORT}
  
  Share the network URL with participants on the same local network.
  `);
});
