import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSocket } from "@/context/SocketContext";
import { Trophy } from "lucide-react";
import LiveLeaderboard from "./LiveLeaderboard";

interface WaitingRoomProps {
  onShowResults: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onShowResults }) => {
  const { quizState, participants, setShowLiveLeaderboard } = useSocket();

  const totalParticipants = quizState.totalParticipants || 0;
  const finishedParticipants = quizState.finishedParticipants || 0;

  // Auto-show results when everyone has completed
  useEffect(() => {
    if (totalParticipants > 0 && finishedParticipants === totalParticipants) {
      // Give some time for participants to see results
      const timer = setTimeout(() => {
        onShowResults();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [finishedParticipants, totalParticipants, onShowResults]);

  // Always show the leaderboard
  useEffect(() => {
    setShowLiveLeaderboard(true);
  }, [setShowLiveLeaderboard]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        <div className="text-center mb-6">
          <Trophy className="h-16 w-16 text-polkadot-pink mx-auto mb-2" />
          <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
          <p className="text-gray-600">
            Your answers have been submitted. Here are the current standings:
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row gap-6">
          {/* Participant Status Panel */}
          <Card className="w-full lg:w-1/3">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Participants</CardTitle>
              <CardDescription>
                {finishedParticipants} of {totalParticipants} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <ul className="space-y-2 max-h-80 overflow-y-auto">
                  {participants.map((participant) => (
                    <li
                      key={participant.id}
                      className="flex items-center justify-between gap-2 p-2 bg-white rounded text-sm"
                    >
                      <span className="font-medium">{participant.name}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          participant.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : participant.status === "in-progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {participant.status === "completed" && "Completed"}
                        {participant.status === "in-progress" && "In Progress"}
                        {participant.status === "waiting" && "Waiting"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Panel */}
          <div className="w-full lg:w-2/3">
            <LiveLeaderboard isMinimized={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
