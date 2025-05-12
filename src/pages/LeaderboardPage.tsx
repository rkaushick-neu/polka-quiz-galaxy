import React, { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserResult, Participant } from "@/types";
import {
  TrophyIcon,
  MedalIcon,
  ActivityIcon,
  Users,
  Clock,
  CheckCircle2,
  Circle,
  Hourglass,
  ChevronUp,
  Star,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const LeaderboardPage: React.FC = () => {
  const {
    results,
    participants,
    quizState,
    setShowLiveLeaderboard,
    serverInfo,
  } = useSocket();
  const [showParticipantDetails, setShowParticipantDetails] = useState(false);

  // Always show the leaderboard on this page
  useEffect(() => {
    setShowLiveLeaderboard(true);

    // Title for the page
    document.title = "Polkadot Quiz - Live Leaderboard";
  }, [setShowLiveLeaderboard]);

  const sortedResults = [...results].sort((a, b) => b.score - a.score);
  const totalParticipants = quizState.totalParticipants || 0;
  const finishedParticipants = quizState.finishedParticipants || 0;

  // Calculate completion percentage
  const completionPercentage =
    totalParticipants > 0
      ? Math.round((finishedParticipants / totalParticipants) * 100)
      : 0;

  // Get participant status counts
  const inProgressCount = participants.filter(
    (p) => p.status === "in-progress"
  ).length;
  const waitingCount = participants.filter(
    (p) => p.status === "waiting"
  ).length;

  // Get badge for participant status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 border-green-300"
          >
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 border-blue-300"
          >
            <Hourglass className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-100 text-gray-800 border-gray-300"
          >
            <Circle className="mr-1 h-3 w-3" /> Waiting
          </Badge>
        );
    }
  };

  // Map to track participant status
  const participantStatusMap = participants.reduce((acc, participant) => {
    acc[participant.walletAddress || participant.id] = participant.status;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Polkadot Quiz{" "}
            <span className="text-polkadot-pink">Live Leaderboard</span>
          </h1>
          <p className="text-gray-600">Real-time results and standings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Quiz Status Card */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quiz Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <ActivityIcon
                    className={`h-8 w-8 ${
                      quizState.inProgress ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                  <div>
                    <p className="font-medium">
                      {quizState.inProgress
                        ? "Quiz in Progress"
                        : "Quiz Not Started"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {quizState.inProgress
                        ? `${finishedParticipants} of ${totalParticipants} participants completed`
                        : "Waiting for quiz to start"}
                    </p>
                  </div>
                  <Badge
                    className={`ml-auto ${
                      finishedParticipants === totalParticipants &&
                      totalParticipants > 0
                        ? "bg-green-500"
                        : quizState.inProgress
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  >
                    {finishedParticipants === totalParticipants &&
                    totalParticipants > 0
                      ? "Completed"
                      : quizState.inProgress
                      ? "In Progress"
                      : "Not Started"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Completion Progress</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Participants Stats Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Participants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-polkadot-pink">
                    {totalParticipants}
                  </p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">
                    {finishedParticipants}
                  </p>
                  <p className="text-sm text-gray-500">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-500">
                    {inProgressCount}
                  </p>
                  <p className="text-sm text-gray-500">In Progress</p>
                </div>
              </div>

              {participants.length > 0 && (
                <button
                  onClick={() =>
                    setShowParticipantDetails(!showParticipantDetails)
                  }
                  className="w-full mt-4 text-xs text-gray-500 flex items-center justify-center gap-1 hover:text-gray-700"
                >
                  {showParticipantDetails ? "Hide details" : "Show details"}
                  <ChevronUp
                    className={`h-3 w-3 transition-transform ${
                      showParticipantDetails ? "" : "rotate-180"
                    }`}
                  />
                </button>
              )}

              {showParticipantDetails && (
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto text-sm">
                  {participants.map((participant, idx) => (
                    <div
                      key={participant.id || idx}
                      className="flex justify-between items-center p-1.5 rounded hover:bg-gray-50"
                    >
                      <span className="truncate">{participant.name}</span>
                      {getStatusBadge(participant.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Leaderboard Card */}
        <Card className="w-full shadow-lg border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold">
                  Current Standings
                </CardTitle>
                <CardDescription className="text-gray-500 mt-1">
                  Participants ranked by quiz performance
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-polkadot-pink text-white">
                {results.length}/{totalParticipants} Scored
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sortedResults.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {sortedResults.map((result: UserResult, index: number) => {
                  const participantId = result.walletAddress || "";
                  const status =
                    participantStatusMap[participantId] || "completed";

                  return (
                    <div
                      key={result.walletAddress || index}
                      className={`flex items-center justify-between p-4 ${
                        index === 0
                          ? "bg-yellow-50"
                          : index === 1
                          ? "bg-gray-50"
                          : index === 2
                          ? "bg-amber-50"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white
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
                          {index === 0 ? (
                            <TrophyIcon className="h-5 w-5" />
                          ) : (
                            index + 1
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {result.name || result.displayName}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(status)}
                            {result.completedQuestions && (
                              <p className="text-xs text-gray-500">
                                {result.completedQuestions} questions completed
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="bg-polkadot-pink/10 text-polkadot-pink border-polkadot-pink text-lg px-3 py-1"
                        >
                          {result.score}
                          {index === 0 && (
                            <Star className="h-3 w-3 ml-1 inline fill-polkadot-pink" />
                          )}
                        </Badge>
                        {index < 3 && (
                          <MedalIcon
                            className={`h-5 w-5 ${
                              index === 0
                                ? "text-yellow-500"
                                : index === 1
                                ? "text-gray-400"
                                : "text-amber-700"
                            }`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 px-4">
                <Hourglass className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p className="text-gray-500 mb-1">No results yet</p>
                <p className="text-sm text-gray-400">
                  Waiting for participants to complete questions
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 mt-8 space-y-2">
          <p>
            This leaderboard updates in real-time as participants complete the
            quiz.
          </p>
          {serverInfo && (
            <p>
              Server: {serverInfo.ip}:{serverInfo.port}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
