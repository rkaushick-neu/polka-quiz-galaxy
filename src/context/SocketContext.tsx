import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";
import {
  Participant,
  QuizState,
  ServerInfo,
  UserResult,
  UserAnswer,
} from "@/types";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  serverInfo: ServerInfo | null;
  participants: Participant[];
  quizState: QuizState;
  registerParticipant: (name: string) => void;
  startQuiz: () => void;
  completeQuiz: (score: number, answers: UserAnswer[]) => void;
  updateQuestionProgress: (questionIndex: number, currentScore: number) => void;
  results: UserResult[];
  showLiveLeaderboard: boolean;
  setShowLiveLeaderboard: (show: boolean) => void;
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
  updateQuestionProgress: () => {},
  results: [],
  showLiveLeaderboard: false,
  setShowLiveLeaderboard: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [quizState, setQuizState] = useState<QuizState>(defaultQuizState);
  const [results, setResults] = useState<UserResult[]>([]);
  const [showLiveLeaderboard, setShowLiveLeaderboard] = useState(false);
  const { toast } = useToast();
  // Initialize socket connection
  useEffect(() => {
    // Get the current hostname - works on both localhost and network IP
    const hostname = window.location.hostname;
    const socketUrl = `http://${hostname}:3001`;

    console.log("Connecting to socket server at:", socketUrl);
    const socketInstance = io(socketUrl);

    socketInstance.on("connect", () => {
      setIsConnected(true);
      toast({
        title: "Connected to server",
        description: "You're connected to the quiz server",
      });

      // Fetch server info
      fetch(`${socketUrl}/server-info`)
        .then((res) => res.json())
        .then(setServerInfo)
        .catch((err) => console.error("Failed to fetch server info:", err));
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      toast({
        title: "Disconnected from server",
        description: "Connection to the quiz server was lost",
        variant: "destructive",
      });
    });

    socketInstance.on(
      "participants-updated",
      (updatedParticipants: Participant[]) => {
        setParticipants(updatedParticipants);
      }
    );

    socketInstance.on("quiz-state-updated", (updatedState: QuizState) => {
      setQuizState(updatedState);
    });

    socketInstance.on("quiz-started", () => {
      toast({
        title: "Quiz Started",
        description: "The quiz has started!",
      });
    });
    socketInstance.on("all-completed", (quizResults: UserResult[]) => {
      setResults(quizResults);
      toast({
        title: "Quiz Completed",
        description: "All participants have completed the quiz!",
      });
    });

    socketInstance.on(
      "live-leaderboard-update",
      (liveResults: UserResult[]) => {
        setResults(liveResults);
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [toast]);

  // Register participant with name (no wallet)
  const registerParticipant = useCallback(
    (name: string) => {
      if (socket) {
        // Generate a random ID to use instead of wallet address
        const randomId = Math.random().toString(36).substring(2, 15);
        socket.emit("register", { name, walletAddress: randomId });
        toast({
          title: "Registered",
          description: `You're registered as ${name}`,
        });
      } else {
        toast({
          title: "Registration Failed",
          description: "Server not available",
          variant: "destructive",
        });
      }
    },
    [socket, toast]
  );

  // Start the quiz
  const startQuiz = useCallback(() => {
    if (socket) {
      socket.emit("start-quiz");
    }
  }, [socket]); // Complete the quiz
  const completeQuiz = useCallback(
    (score: number, answers: UserAnswer[]) => {
      if (socket) {
        socket.emit("quiz-completed", {
          score,
          answers,
        });

        toast({
          title: "Quiz Submitted",
          description: "Your answers have been submitted",
        });
      }
    },
    [socket, toast]
  );

  // Update question progress
  const updateQuestionProgress = useCallback(
    (questionIndex: number, currentScore: number) => {
      if (socket) {
        socket.emit("question-progress", {
          questionIndex,
          score: currentScore,
        });
      }
    },
    [socket]
  );
  const contextValue: SocketContextType = {
    socket,
    isConnected,
    serverInfo,
    participants,
    quizState,
    registerParticipant,
    startQuiz,
    completeQuiz,
    updateQuestionProgress,
    results,
    showLiveLeaderboard,
    setShowLiveLeaderboard,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
