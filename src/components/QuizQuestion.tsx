import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useQuiz } from "@/context/QuizContext";
import { useSocket } from "@/context/SocketContext";
import { calculateScore } from "@/lib/utils";
import { AlertCircle, BarChart2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LiveLeaderboard from "./LiveLeaderboard";

interface QuizQuestionProps {
  onComplete: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ onComplete }) => {
  const {
    quiz,
    currentQuestionIndex,
    handleAnswer,
    nextQuestion,
    prevQuestion,
    userAnswers,
    hasAnsweredCurrent,
    selectedAnswerIndex,
    userScore,
  } = useQuiz();

  const {
    completeQuiz,
    quizState,
    showLiveLeaderboard,
    setShowLiveLeaderboard,
  } = useSocket();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  useEffect(() => {
    if (isLastQuestion && hasAnsweredCurrent) {
      setShowAlert(true);
    }
  }, [isLastQuestion, hasAnsweredCurrent]);

  const handleFinishQuiz = () => {
    // Calculate score based on correct answers
    const score = calculateScore(quiz.questions, userAnswers);

    // Send results to server
    completeQuiz(score, userAnswers);

    // Continue to waiting room
    onComplete();
  };

  const getOptionClassName = (optionIndex: number) => {
    if (!hasAnsweredCurrent) {
      return selectedAnswerIndex === optionIndex
        ? "bg-polkadot-pink/10 border-polkadot-pink"
        : "hover:bg-gray-50 border-gray-200";
    }

    if (currentQuestion.correctAnswer === optionIndex) {
      return "bg-green-50 border-green-500 text-green-700";
    }

    if (selectedAnswerIndex === optionIndex) {
      return "bg-red-50 border-red-500 text-red-700";
    }

    return "opacity-50 border-gray-200";
  };
  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {quizState.inProgress && (
        <div className="flex justify-between items-center text-sm">
          <span>Total Participants: {quizState.totalParticipants}</span>
          <span>Completed: {quizState.finishedParticipants}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLiveLeaderboard(!showLiveLeaderboard)}
            className="flex items-center gap-1 text-polkadot-pink hover:text-polkadot-pink hover:bg-polkadot-pink/10"
          >
            <BarChart2 className="h-4 w-4" />
            {showLiveLeaderboard ? "Hide" : "Show"} Leaderboard
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div
          className={`flex-1 ${showLiveLeaderboard ? "md:w-2/3" : "w-full"}`}
        >
          <Card className="w-full bg-white shadow-md">
            <CardHeader>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span className="text-sm font-medium">
                  Progress:{" "}
                  {Math.round(
                    ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden">
                <div
                  className="bg-polkadot-pink h-full transition-all duration-300 ease-out"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) / quiz.questions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <CardTitle className="text-xl md:text-2xl mt-4">
                {currentQuestion.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      !hasAnsweredCurrent &&
                      handleAnswer(currentQuestion.id, index)
                    }
                    disabled={hasAnsweredCurrent}
                    className={`w-full text-left p-4 border rounded-lg transition-all ${getOptionClassName(
                      index
                    )}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-md">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevQuestion}
                disabled={isFirstQuestion}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {isLastQuestion ? (
                  <Button
                    onClick={handleFinishQuiz}
                    className="btn-primary"
                    disabled={!hasAnsweredCurrent}
                  >
                    Finish Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="btn-primary"
                    disabled={!hasAnsweredCurrent}
                  >
                    Next
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>

        {showLiveLeaderboard && (
          <div className="md:w-1/3">
            <LiveLeaderboard isMinimized={false} />
          </div>
        )}
      </div>

      {showAlert && (
        <Alert className="bg-green-50 border-green-200">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            You're about to complete the quiz. Your results will be submitted to
            the network.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QuizQuestion;
