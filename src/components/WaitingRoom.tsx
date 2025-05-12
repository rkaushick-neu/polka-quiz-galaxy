
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSocket } from "@/context/SocketContext";
import { User, Clock } from "lucide-react";

interface WaitingRoomProps {
  onShowResults: () => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ onShowResults }) => {
  const { quizState, participants, results } = useSocket();
  const [progress, setProgress] = useState(0);
  
  const totalParticipants = quizState.totalParticipants || 0;
  const finishedParticipants = quizState.finishedParticipants || 0;
  
  // Auto-show results when everyone has completed
  useEffect(() => {
    if (totalParticipants > 0 && finishedParticipants === totalParticipants) {
      // Give some time for the animation to complete
      const timer = setTimeout(() => {
        onShowResults();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [finishedParticipants, totalParticipants, onShowResults]);

  // Calculate progress percentage
  useEffect(() => {
    if (totalParticipants > 0) {
      setProgress((finishedParticipants / totalParticipants) * 100);
    }
  }, [finishedParticipants, totalParticipants]);

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
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-24 h-24 rounded-full border-4 border-polkadot-pink/30 border-t-polkadot-pink animate-spin mb-6"></div>
            <p className="text-lg font-medium">Waiting for others to finish...</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Submitted</span>
              <span>
                {finishedParticipants} of {totalParticipants} participants
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Participant Status</span>
            </h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto">
              {participants.map((participant) => (
                <li key={participant.id} className="flex items-center justify-between gap-2 p-2 bg-white rounded text-sm">
                  <span>{participant.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    participant.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : participant.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {participant.status === 'completed' && 'Completed'}
                    {participant.status === 'in-progress' && 'In Progress'}
                    {participant.status === 'waiting' && 'Waiting'}
                  </span>
                </li>
              ))}
            </ul>
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
};

export default WaitingRoom;
