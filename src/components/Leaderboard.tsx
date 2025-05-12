
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuiz } from "@/context/QuizContext";
import { useWallet } from "@/context/WalletContext";
import { useSocket } from "@/context/SocketContext";
import { toast } from "@/components/ui/use-toast";
import { Trophy, Network } from "lucide-react";

const Leaderboard: React.FC = () => {
  const { userScore, resetQuiz } = useQuiz();
  const { wallet } = useWallet();
  const { results } = useSocket();

  const topScorers = [...results].sort((a, b) => b.score - a.score).slice(0, 10);
  const userRank = topScorers.findIndex((result) => result.walletAddress === wallet.address) + 1;
  const isWinner = userRank <= 3 && userRank > 0;

  const handleClaim = () => {
    toast({
      title: "Reward Claimed",
      description: "You will receive your WND tokens shortly.",
    });
  };

  const handleReset = () => {
    // Reset quiz state
    resetQuiz();
    // This will take users back to the welcome page
    window.location.reload(); 
  };

  const getBadgeEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "";
  };

  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-polkadot-pink" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Quiz Leaderboard</h1>
          <p className="text-gray-600">
            {isWinner
              ? "Congratulations! You're eligible to claim WND rewards! 🎉"
              : "Quiz completed! Here are the top scorers."}
          </p>
          <div className="mt-2 flex justify-center items-center gap-2 text-sm text-gray-500">
            <Network className="h-4 w-4" />
            <span>{results.length} participants completed the quiz</span>
          </div>
        </div>

        {userRank > 0 && (
          <Card className="mb-6 border-2 border-polkadot-pink bg-polkadot-pink/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Your Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-polkadot-pink text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                    {userRank}
                  </div>
                  <div>
                    <div className="font-medium">You</div>
                    <div className="text-sm text-gray-500">{truncateAddress(wallet.address || "")}</div>
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {userScore} <span className="text-base font-normal">points</span>
                </div>
              </div>
              {isWinner && (
                <Button 
                  onClick={handleClaim} 
                  className="w-full mt-4 btn-primary"
                >
                  Claim WND Reward
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {topScorers.map((result, index) => {
                const isUser = result.walletAddress === wallet.address;
                return (
                  <div
                    key={result.walletAddress}
                    className={`flex justify-between items-center p-4 ${
                      isUser ? "bg-polkadot-pink/5" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold 
                        ${index < 3 ? "bg-polkadot-pink text-white" : "bg-gray-100 text-gray-500"}`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center font-medium">
                          {result.name || truncateAddress(result.walletAddress)}{" "}
                          {index < 3 && <span className="ml-1">{getBadgeEmoji(index + 1)}</span>}
                          {isUser && <span className="ml-2 text-xs bg-polkadot-pink text-white px-2 py-0.5 rounded-full">You</span>}
                        </div>
                        {result.name && (
                          <div className="text-sm text-gray-500">{truncateAddress(result.walletAddress)}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {result.score} <span className="text-sm font-normal">points</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button onClick={handleReset} variant="outline" className="mx-auto">
            Start New Quiz
          </Button>
        </div>
      </div>
    </div>
  );
                          {isUser && <span className="ml-2 text-xs bg-polkadot-pink text-white px-2 py-0.5 rounded-full">You</span>}
                        </div>
                        {result.displayName && (
                          <div className="text-sm text-gray-500">{truncateAddress(result.walletAddress)}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {result.score} <span className="text-sm font-normal">points</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button onClick={resetQuiz} variant="outline" className="mx-auto">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
