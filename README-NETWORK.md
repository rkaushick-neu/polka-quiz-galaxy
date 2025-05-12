# Polkadot Quiz Galaxy

A networked quiz application where participants connect to a local server, answer questions about Polkadot blockchain, and compete for the best scores.

## Features

- Real-time participant tracking
- Connect Polkadot wallet to authenticate
- Synchronized quiz state across all participants
- Real-time leaderboard showing results from all participants
- Local network connection using WebSockets

## How to Run

### 1. Start the Server and Client

```bash
# Install dependencies
npm install

# Start both server and client
npm run start
```

This will start:

- WebSocket server on port 3001
- React application on port 5173

### 2. Connect Multiple Participants

1. Connect from your computer using `http://localhost:5173`
2. Other participants on the same network can connect using the IP address shown on the server console
   (Example: `http://192.168.1.100:5173`)

## Network Architecture

The application uses a simple client-server architecture:

- **Server**: Node.js with Express and Socket.io

  - Tracks connected participants
  - Manages quiz state (who's taking/completed the quiz)
  - Collects and broadcasts results

- **Client**: React application
  - Connects to server via WebSocket
  - Registers participants with name and wallet address
  - Sends and receives real-time updates
  - Shows synchronized state across all devices

## How to Use

1. Connect your Polkadot wallet
2. Enter your name to register for the quiz
3. Start the quiz when all participants are ready
4. Answer all questions
5. Wait for all participants to complete
6. View the final leaderboard with everyone's scores

## Technical Details

- React with TypeScript
- Socket.io for real-time communication
- shadcn/ui components with Tailwind CSS
- Polkadot.js integration for wallet connectivity
