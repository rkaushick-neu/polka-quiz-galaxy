// Server types - CommonJS doesn't support TypeScript interfaces directly
// Instead, we'll export object validators/constructors for these types

/**
 * @typedef {Object} Participant
 * @property {string} id
 * @property {string} name
 * @property {string} [walletAddress] - Optional wallet address
 * @property {'waiting'|'in-progress'|'completed'} status
 * @property {number} [currentQuestion] - Track which question the participant is on
 */

/**
 * @typedef {Object} QuizState
 * @property {boolean} inProgress
 * @property {number} totalParticipants
 * @property {number} finishedParticipants
 */

/**
 * @typedef {Object} QuizResult
 * @property {string} name
 * @property {string} [walletAddress] - Optional wallet address
 * @property {number} score
 * @property {Array<{questionId: string, selectedAnswer: number}>} answers
 * @property {number} [completedQuestions] - Track progress during the quiz
 */

// Create empty objects to represent the types (for reference only)
const Participant = {};
const QuizState = {};
const QuizResult = {};

module.exports = {
  Participant,
  QuizState,
  QuizResult,
};
