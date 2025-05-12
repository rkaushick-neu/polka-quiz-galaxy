import React, { useState, useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import Header from "./Header";
import WelcomePage from "./WelcomePage";
import QuizQuestion from "./QuizQuestion";
import WaitingRoom from "./WaitingRoom";
import Leaderboard from "./Leaderboard";

enum QuizStage {
  WELCOME,
  QUIZ,
  WAITING,
  RESULTS,
}

const QuizApp: React.FC = () => {
  const [stage, setStage] = useState<QuizStage>(QuizStage.WELCOME);
  const { quizState, results } = useSocket();

  // Listen for quiz completion status
  useEffect(() => {
    // If all participants have completed and we have results, show the results screen
    if (
      results.length > 0 &&
      quizState.finishedParticipants > 0 &&
      quizState.finishedParticipants === quizState.totalParticipants &&
      stage === QuizStage.WAITING
    ) {
      // Add a short delay to ensure animations complete
      const timer = setTimeout(() => {
        setStage(QuizStage.RESULTS);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [quizState, results, stage]);

  const handleStartQuiz = () => {
    setStage(QuizStage.QUIZ);
  };

  const handleCompleteQuiz = () => {
    setStage(QuizStage.WAITING);
  };

  const handleShowResults = () => {
    setStage(QuizStage.RESULTS);
  };

  return (
    <div className="min-h-screen gradient-bg">
      <Header />

      <main className="container mx-auto px-4 py-6">
        {stage === QuizStage.WELCOME && (
          <WelcomePage onStartQuiz={handleStartQuiz} />
        )}

        {stage === QuizStage.QUIZ && (
          <QuizQuestion onComplete={handleCompleteQuiz} />
        )}

        {stage === QuizStage.WAITING && (
          <WaitingRoom onShowResults={handleShowResults} />
        )}

        {stage === QuizStage.RESULTS && <Leaderboard />}
      </main>
    </div>
  );
};

export default QuizApp;
