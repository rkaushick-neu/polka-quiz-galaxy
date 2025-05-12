
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Quiz, UserAnswer, UserResult, Question } from "../types";
import { quizData } from "../data/quizData";
import { toast } from "@/components/ui/sonner";

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
  const [results, setResults] = useState<UserResult[]>([
    { walletAddress: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY", score: 9, displayName: "Alice" },
    { walletAddress: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty", score: 8, displayName: "Bob" },
    { walletAddress: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y", score: 7, displayName: "Charlie" },
    { walletAddress: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy", score: 6, displayName: "Dave" },
  ]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);

  const currentQuestion: Question = quiz.questions[currentQuestionIndex];
  const hasAnsweredCurrent = userAnswers.some(answer => answer.questionId === currentQuestion.id);
  const selectedAnswerIndex = userAnswers.find(answer => answer.questionId === currentQuestion.id)?.selectedOption ?? null;

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

  const calculateScore = (): number => {
    return userAnswers.reduce((score, answer) => {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      if (question && question.correctAnswer === answer.selectedOption) {
        return score + 1;
      }
      return score;
    }, 0);
  };

  const submitQuiz = (walletAddress: string) => {
    const score = calculateScore();
    setUserScore(score);
    
    // Insert user into results, maintaining sort by score
    const newResult: UserResult = { walletAddress, score };
    const newResults = [...results, newResult].sort((a, b) => b.score - a.score);
    
    setResults(newResults);
    setQuizSubmitted(true);
    toast.success("Quiz submitted successfully!");
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
