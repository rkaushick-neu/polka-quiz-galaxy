# Live Leaderboard Feature

This document provides an overview of the real-time leaderboard feature recently added to the Polkadot Quiz Galaxy application.

## Overview

The live leaderboard feature enhances the quiz experience by providing real-time updates on participant progress and scores throughout the quiz. This feature allows participants to track their standing among other users without waiting for everyone to complete the entire quiz.

## Features

- **Real-time Score Updates**: Scores are updated after each question is answered
- **Dynamic Participant Tracking**: New participants appear on the leaderboard as they join
- **Progress Indicators**: Shows how many questions each participant has completed
- **Toggleable Display**: Leaderboard can be shown or hidden during the quiz
- **Responsive Design**: Adapts to different screen sizes for optimal viewing

## How It Works

1. As participants answer questions, their progress and current score are sent to the server
2. The server maintains the current standings and broadcasts updates to all connected clients
3. The live leaderboard component renders the latest standings with animations for position changes
4. The final leaderboard is displayed when all participants have completed the quiz

## Implementation Details

The feature is implemented using the following components:

- **Server**:

  - Tracks individual question progress
  - Calculates and distributes real-time score updates
  - Maintains participant status

- **Client**:
  - `LiveLeaderboard.tsx`: Displays the current standings
  - `SocketContext.tsx`: Manages the WebSocket connection for real-time updates
  - `QuizQuestion.tsx`: Reports progress after each question
  - `WaitingRoom.tsx`: Shows the leaderboard while waiting for others

## Using the Feature

- Click the "Show Leaderboard" button during the quiz to view current standings
- The leaderboard automatically updates as participants answer questions
- Scores and positions update in real-time
- Toggle the leaderboard view to focus on the quiz questions

## Future Enhancements

Potential improvements for the live leaderboard include:

- Animations for position changes
- Detailed statistics on question performance
- Achievement badges for reaching certain milestones
- Historical performance tracking across multiple quiz sessions
