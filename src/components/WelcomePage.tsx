
import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { useQuiz } from "@/context/QuizContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface WelcomePageProps {
  onStartQuiz: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartQuiz }) => {
  const { wallet, connectWallet } = useWallet();
  const { quiz } = useQuiz();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="mb-12 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-polkadot-pink animate-pulse-light"></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to the <span className="text-polkadot-pink">Polkadot</span> Quiz
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Test your knowledge of Polkadot blockchain and compete with other students for a chance to win WND rewards!
        </p>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
          <CardDescription>{quiz.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-4">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-polkadot-pink text-white flex items-center justify-center text-xs">✓</span>
              <span>{quiz.questions.length} multiple choice questions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-polkadot-pink text-white flex items-center justify-center text-xs">✓</span>
              <span>Connect your Polkadot.js wallet to participate</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-polkadot-pink text-white flex items-center justify-center text-xs">✓</span>
              <span>Top scorers can claim WND rewards</span>
            </li>
          </ul>
        </CardContent>
        <CardFooter>
          {!wallet.connected ? (
            <Button onClick={connectWallet} className="w-full btn-primary">
              Connect Polkadot.js Wallet
            </Button>
          ) : (
            <Button onClick={onStartQuiz} className="w-full btn-primary">
              Start Quiz
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default WelcomePage;
