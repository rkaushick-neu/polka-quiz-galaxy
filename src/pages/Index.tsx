
import React from "react";
import QuizApp from "@/components/QuizApp";
import { WalletProvider } from "@/context/WalletContext";
import { QuizProvider } from "@/context/QuizContext";

const Index = () => {
  return (
    <WalletProvider>
      <QuizProvider>
        <QuizApp />
      </QuizProvider>
    </WalletProvider>
  );
};

export default Index;
