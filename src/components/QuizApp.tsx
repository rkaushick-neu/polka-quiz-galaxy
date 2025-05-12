
import React, { useState } from "react";
import { useWallet } from "@/context/WalletContext";
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
  const { wallet } = useWallet();

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
        {stage === QuizStage.WELCOME && <WelcomePage onStartQuiz={handleStartQuiz} />}
        
        {stage === QuizStage.QUIZ && <QuizQuestion onComplete={handleCompleteQuiz} />}
        
        {stage === QuizStage.WAITING && <WaitingRoom onShowResults={handleShowResults} />}
        
        {stage === QuizStage.RESULTS && <Leaderboard />}
      </main>
    </div>
  );
};

export default QuizApp;
