import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSocket } from "@/context/SocketContext";
import { UserResult } from "@/types";
import { Badge } from "@/components/ui/badge";

interface LiveLeaderboardProps {
  isMinimized?: boolean;
}

const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  isMinimized = false,
}) => {
  const { results, participants, quizState } = useSocket();

  const sortedResults = [...results].sort((a, b) => b.score - a.score);

  // For minimized view, only show top 3
  const displayResults = isMinimized
    ? sortedResults.slice(0, 3)
    : sortedResults;
  return (
    <Card
      className={`bg-white shadow-md ${
        isMinimized ? "w-64" : "w-full max-w-md"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">Live Leaderboard</CardTitle>
          <Badge variant="outline" className="bg-polkadot-pink text-white">
            {results.length}/{participants.length} Completed
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {displayResults.length > 0 ? (
          <div className="space-y-2">
            {displayResults.map((result: UserResult, index: number) => (
              <div
                key={result.walletAddress || index}
                className="flex items-center justify-between p-2 rounded-md border border-gray-100 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold text-white
                      ${
                        index === 0
                          ? "bg-yellow-500"
                          : index === 1
                          ? "bg-gray-400"
                          : index === 2
                          ? "bg-amber-700"
                          : "bg-gray-300"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium truncate">{result.name}</span>
                </div>
                <span className="font-bold text-polkadot-pink">
                  {result.score}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            No results yet. Waiting for participants to complete questions.
          </p>
        )}

        {isMinimized && results.length > 3 && (
          <p className="text-center text-xs text-gray-500 mt-2">
            +{results.length - 3} more participants
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveLeaderboard;
