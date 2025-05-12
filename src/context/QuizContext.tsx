
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Quiz, UserAnswer, UserResult, Question } from "../types";
import { quizData } from "../data/quizData";
import { useToast } from "@/components/ui/use-toast";
import { useSocket } from "./SocketContext";
import { calculateScore } from "@/lib/utils";

interface QuizContextType {
  quiz: Quiz;
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  results: UserResult[];
  userScore: number;
  quizSubmitted: boolean;
  handleAnswer: (questionId: number, optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: (walletAddress: string) => void;
  resetQuiz: () => void;
  hasAnsweredCurrent: boolean;
  selectedAnswerIndex: number | null;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [quiz] = useState<Quiz>(quizData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [results, setResults] = useState<UserResult[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const { toast } = useToast();
  const { results: networkResults } = useSocket();

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];
  const hasAnsweredCurrent = userAnswers.some(answer => answer.questionId === currentQuestion.id);
  const selectedAnswerIndex = userAnswers.find(answer => answer.questionId === currentQuestion.id)?.selectedOption ?? null;

  // Update results from network when available
  useEffect(() => {
    if (networkResults.length > 0) {
      setResults(networkResults);
    }
  }, [networkResults]);

  const handleAnswer = (questionId: number, optionIndex: number) => {
    const updatedAnswers = [
      ...userAnswers.filter((answer) => answer.questionId !== questionId),
      { questionId, selectedOption: optionIndex },
    ];
    setUserAnswers(updatedAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitQuiz = (walletAddress: string) => {
    const score = calculateScore(quiz.questions, userAnswers);
    setUserScore(score);
    setQuizSubmitted(true);
    
    toast({
      title: "Quiz Submitted",
      description: "Your answers have been submitted successfully!",
    });
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setQuizSubmitted(false);
  };

  return (
    <QuizContext.Provider
      value={{
        quiz,
        currentQuestionIndex,
        userAnswers,
        results,
        userScore,
        quizSubmitted,
        handleAnswer,
        nextQuestion,
        prevQuestion,
        submitQuiz,
        resetQuiz,
        hasAnsweredCurrent,
        selectedAnswerIndex,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};

  return (
    <QuizContext.Provider
      value={{
        quiz,
        currentQuestionIndex,
        userAnswers,
        results,
        userScore,
        quizSubmitted,
        handleAnswer,
        nextQuestion,
        prevQuestion,
        submitQuiz,
        resetQuiz,
        hasAnsweredCurrent,
        selectedAnswerIndex,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
