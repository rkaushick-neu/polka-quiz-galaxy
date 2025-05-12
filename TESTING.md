# Polkadot Quiz Galaxy - Testing Guide

This guide will help you test the Polkadot Quiz application with multiple participants on a local network.

## Running the Application

1. Start both the server and client:

   ```bash
   npm run start
   ```

   This will launch:

   - WebSocket server on port 3001
   - React client on port 8080

2. You'll see output like this:

   ```
   Server running!
   - Local:    http://localhost:3001
   - Network:  http://192.168.x.x:3001

   VITE ready
   - Local:    http://localhost:8080/
   - Network:  http://192.168.x.x:8080/
   ```

## Testing with Multiple Participants

### Option 1: On a Single Computer (Easiest)

1. Open multiple browser windows or different browsers (Chrome, Firefox, Edge)
2. Navigate to `http://localhost:8080` in each window
3. In each browser:
   - Connect wallet (simulated)
   - Enter a different participant name
   - Complete the quiz

### Option 2: Multiple Devices on Same Network

1. On your computer, run the application
2. On other devices (phones, tablets, laptops) on the same WiFi:
   - Open a browser and navigate to your computer's network IP, e.g.:
   - `http://192.168.x.x:8080` (use the actual IP shown in the terminal)
3. Each device should:
   - Connect wallet (simulated)
   - Enter a unique participant name
   - Complete the quiz

## Testing Flow

1. **Welcome Screen**:

   - Connect wallet
   - Enter name
   - See other participants join
   - Start quiz when ready

2. **Quiz Questions**:

   - Answer multiple-choice questions
   - See your score for each answer
   - Complete all questions

3. **Waiting Room**:

   - After completing the quiz, you'll see a waiting room
   - Watch as other participants finish
   - See real-time status updates

4. **Results Leaderboard**:
   - Once all participants finish, see the final leaderboard
   - Compare scores between all participants
   - Option to start a new quiz

## Troubleshooting

- If connections fail, ensure all devices are on the same local network
- Check that no firewalls are blocking the connections
- Make sure the server console shows active connections

Happy testing!
