
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface WaitingRoomProps {
  onShowResults: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onShowResults }) => {
  const [submittedCount, setSubmittedCount] = useState(12);
  const [totalParticipants, setTotalParticipants] = useState(25);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate increasing submissions over time
    const interval = setInterval(() => {
      setSubmittedCount((prev) => {
        const newCount = Math.min(prev + 1, totalParticipants);
        if (newCount === totalParticipants) {
          clearInterval(interval);
          // Show results after a short delay when everyone has submitted
          setTimeout(onShowResults, 2000);
        }
        return newCount;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onShowResults, totalParticipants]);

  useEffect(() => {
    // Animate progress
    setProgress((submittedCount / totalParticipants) * 100);
  }, [submittedCount, totalParticipants]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Thank You!</CardTitle>
          <CardDescription className="text-center text-lg">
            Your answers have been submitted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-24 h-24 rounded-full border-4 border-polkadot-pink/30 border-t-polkadot-pink animate-spin mb-6"></div>
            <p className="text-lg font-medium">Waiting for others to finish...</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Submitted</span>
              <span>
                {submittedCount} of {totalParticipants} participants
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <p className="text-center text-sm text-gray-500 px-8">
            The results will be displayed once all participants have submitted their answers
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingRoom;
