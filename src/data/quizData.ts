
import { Quiz } from "../types";

export const quizData: Quiz = {
  id: "polkadot-basics-quiz",
  title: "Polkadot Blockchain Basics",
  description: "Test your knowledge about Polkadot blockchain and its ecosystem",
  questions: [
    {
      id: 1,
      text: "What is the native cryptocurrency of the Polkadot network?",
      options: ["DOT", "ETH", "ADA", "SOL"],
      correctAnswer: 0,
    },
    {
      id: 2,
      text: "What is the main purpose of Polkadot's relay chain?",
      options: [
        "To secure the network and validate transactions", 
        "To store user data", 
        "To run smart contracts", 
        "To facilitate cross-chain transactions"
      ],
      correctAnswer: 0,
    },
    {
      id: 3,
      text: "What are the individual blockchains that connect to Polkadot called?",
      options: ["Validators", "Parachains", "Nominators", "Collators"],
      correctAnswer: 1,
    },
    {
      id: 4,
      text: "Who is the founder of Polkadot?",
      options: ["Vitalik Buterin", "Charles Hoskinson", "Gavin Wood", "Satoshi Nakamoto"],
      correctAnswer: 2,
    },
    {
      id: 5,
      text: "What is Westend in the Polkadot ecosystem?",
      options: [
        "A parachain focusing on DeFi", 
        "A test network (testnet)", 
        "A bridge to Ethereum", 
        "The governance council"
      ],
      correctAnswer: 1,
    },
    {
      id: 6,
      text: "What consensus mechanism does Polkadot use?",
      options: ["Proof of Work", "Nominated Proof of Stake", "Delegated Proof of Stake", "Proof of Authority"],
      correctAnswer: 1,
    },
    {
      id: 7,
      text: "What programming language is primarily used to develop on Polkadot?",
      options: ["JavaScript", "Solidity", "Python", "Rust"],
      correctAnswer: 3,
    },
    {
      id: 8,
      text: "What is the purpose of XCM in Polkadot?",
      options: [
        "Cross-chain message format for communication between parachains", 
        "Execution code module for smart contracts", 
        "External chain monitor for security", 
        "Exchange currency mechanism for trading"
      ],
      correctAnswer: 0,
    },
    {
      id: 9,
      text: "What is Kusama in relation to Polkadot?",
      options: [
        "A competitor blockchain", 
        "A canary network and testing environment", 
        "A Layer 2 scaling solution", 
        "A decentralized exchange"
      ],
      correctAnswer: 1,
    },
    {
      id: 10,
      text: "How are parachain slots allocated on the Polkadot network?",
      options: [
        "First come, first served basis", 
        "Through an auction process", 
        "By governance vote only", 
        "Only official partners can get slots"
      ],
      correctAnswer: 1,
    },
  ],
};
