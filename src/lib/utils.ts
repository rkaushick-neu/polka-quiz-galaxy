import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question, UserAnswer } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates a user's score based on their answers to quiz questions
 * @param questions The list of questions from the quiz
 * @param userAnswers The user's answers to the questions
 * @returns The user's score (number of correct answers)
 */
export function calculateScore(
  questions: Question[],
  userAnswers: UserAnswer[]
): number {
  if (!questions.length || !userAnswers.length) return 0;

  let score = 0;

  userAnswers.forEach((userAnswer) => {
    const question = questions.find((q) => q.id === userAnswer.questionId);
    if (question && question.correctAnswer === userAnswer.selectedOption) {
      score++;
    }
  });

  return score;
}
