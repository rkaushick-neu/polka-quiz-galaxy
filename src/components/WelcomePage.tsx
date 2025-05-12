
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";
import { useQuiz } from "@/context/QuizContext";
import { useSocket } from "@/context/SocketContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { User, Network, AlertCircle } from "lucide-react";

interface WelcomePageProps {
  onStartQuiz: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartQuiz }) => {
  const { wallet, connectWallet } = useWallet();
  const { quiz } = useQuiz();
  const { isConnected, registerParticipant, serverInfo, participants, quizState, startQuiz } = useSocket();
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);

  const handleNameRegister = () => {
    if (name.trim()) {
      registerParticipant(name.trim());
      setRegistered(true);
    }
  };

  const handleStartQuiz = () => {
    startQuiz();
    onStartQuiz();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-polkadot-pink animate-pulse-light"></div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to the <span className="text-polkadot-pink">Polkadot</span> Quiz
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Test your knowledge of Polkadot blockchain and compete with others on your local network!
        </p>
      </div>

      {serverInfo && isConnected && (
        <Alert className="max-w-md mb-6">
          <Network className="h-4 w-4" />
          <AlertTitle>Connected to quiz server</AlertTitle>
          <AlertDescription>
            Server: {serverInfo.ip}:{serverInfo.port} | Participants: {participants.length}
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-md mb-6">
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
              <span>Compete with others on your local network</span>
            </li>
          </ul>

          {wallet.connected && !registered && (
            <div className="space-y-3">
              <Separator />
              <Label htmlFor="name">Your Display Name</Label>
              <Input 
                id="name" 
                placeholder="Enter your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          {!wallet.connected ? (
            <Button onClick={connectWallet} className="w-full btn-primary">
              Connect Polkadot.js Wallet
            </Button>
          ) : !registered ? (
            <Button 
              onClick={handleNameRegister} 
              className="w-full btn-primary"
              disabled={!name.trim()}
            >
              Register for Quiz
            </Button>
          ) : quizState.inProgress ? (
            <Button onClick={onStartQuiz} className="w-full btn-primary">
              Join Quiz in Progress
            </Button>
          ) : (
            <Button onClick={handleStartQuiz} className="w-full btn-primary">
              Start Quiz
            </Button>
          )}
        </CardFooter>
      </Card>

      {isConnected && participants.length > 0 && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>Waiting for participants to join</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {participants.map((participant) => (
                <li key={participant.id} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-polkadot-pink" />
                    <span>{participant.name}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                    {participant.status === 'waiting' && 'Ready'}
                    {participant.status === 'in-progress' && 'Taking Quiz'}
                    {participant.status === 'completed' && 'Completed'}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WelcomePage;
