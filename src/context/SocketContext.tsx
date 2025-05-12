import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from "@/components/ui/use-toast";
import { Participant, QuizState, ServerInfo, UserResult } from '@/types';
import { useWallet } from './WalletContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  serverInfo: ServerInfo | null;
  participants: Participant[];
  quizState: QuizState;
  registerParticipant: (name: string) => void;
  startQuiz: () => void;
  completeQuiz: (score: number, answers: any[]) => void;
  results: UserResult[];
}

const defaultQuizState: QuizState = {
  inProgress: false,
  totalParticipants: 0,
  finishedParticipants: 0,
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  serverInfo: null,
  participants: [],
  quizState: defaultQuizState,
  registerParticipant: () => {},
  startQuiz: () => {},
  completeQuiz: () => {},
  results: [],
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [quizState, setQuizState] = useState<QuizState>(defaultQuizState);
  const [results, setResults] = useState<UserResult[]>([]);
  const { toast } = useToast();
  const { address } = useWallet();

  // Initialize socket connection
  useEffect(() => {
    // We'll use localhost for development, but in production this would dynamically
    // use the server's IP from the network
    const socketInstance = io('http://localhost:3001');
    
    socketInstance.on('connect', () => {
      setIsConnected(true);
      toast({
        title: "Connected to server",
        description: "You're connected to the quiz server",
      });
      
      // Fetch server info
      fetch('http://localhost:3001/server-info')
        .then(res => res.json())
        .then(setServerInfo)
        .catch(err => console.error('Failed to fetch server info:', err));
    });
    
    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: "Disconnected from server",
        description: "Connection to the quiz server was lost",
        variant: "destructive",
      });
    });
    
    socketInstance.on('participants-updated', (updatedParticipants: Participant[]) => {
      setParticipants(updatedParticipants);
    });
    
    socketInstance.on('quiz-state-updated', (updatedState: QuizState) => {
      setQuizState(updatedState);
    });
    
    socketInstance.on('quiz-started', () => {
      toast({
        title: "Quiz Started",
        description: "The quiz has started!",
      });
    });
    
    socketInstance.on('all-completed', (quizResults: UserResult[]) => {
      setResults(quizResults);
      toast({
        title: "Quiz Completed",
        description: "All participants have completed the quiz!",
      });
    });
    
    setSocket(socketInstance);
    
    return () => {
      socketInstance.disconnect();
    };
  }, [toast]);
  
  // Register participant with name and wallet address
  const registerParticipant = useCallback((name: string) => {
    if (socket && address) {
      socket.emit('register', { name, walletAddress: address });
      toast({
        title: "Registered",
        description: `You're registered as ${name}`,
      });
    } else {
      toast({
        title: "Registration Failed",
        description: "Wallet not connected or server not available",
        variant: "destructive",
      });
    }
  }, [socket, address, toast]);
  
  // Start the quiz
  const startQuiz = useCallback(() => {
    if (socket) {
      socket.emit('start-quiz');
    }
  }, [socket]);
  
  // Complete the quiz
  const completeQuiz = useCallback((score: number, answers: any[]) => {
    if (socket && address) {
      socket.emit('quiz-completed', {
        walletAddress: address,
        score,
        answers,
      });
      
      toast({
        title: "Quiz Submitted",
        description: "Your answers have been submitted",
      });
    }
  }, [socket, address, toast]);
  
  const contextValue: SocketContextType = {
    socket,
    isConnected,
    serverInfo,
    participants,
    quizState,
    registerParticipant,
    startQuiz,
    completeQuiz,
    results,
  };
  
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
