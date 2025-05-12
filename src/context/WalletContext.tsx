
import React, { createContext, useContext, useState, ReactNode } from "react";
import { WalletState } from "../types";
import { toast } from "@/components/ui/sonner";

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    network: null,
  });

  const connectWallet = async () => {
    try {
      // In a real app, this would connect to Polkadot.js extension
      // For this demo, we'll simulate a connection
      setTimeout(() => {
        const randomAddress = "5" + Array(47).fill(0).map(() => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"[Math.floor(Math.random() * 58)]).join("");
        setWallet({
          connected: true,
          address: randomAddress,
          network: "Westend",
        });
        toast.success("Wallet connected successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const disconnectWallet = () => {
    setWallet({
      connected: false,
      address: null,
      network: null,
    });
    toast.info("Wallet disconnected");
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
