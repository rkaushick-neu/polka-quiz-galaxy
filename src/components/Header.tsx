
import React from "react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/context/WalletContext";

const Header: React.FC = () => {
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  return (
    <header className="flex justify-between items-center w-full py-4 px-6 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-polkadot-pink animate-pulse-light"></div>
        <h1 className="text-xl font-bold text-polkadot-black">Polkadot Quiz</h1>
      </div>

      <div className="flex items-center gap-4">
        {wallet.connected ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-sm">
              <span className="text-gray-600">
                {wallet.address?.substring(0, 6)}...{wallet.address?.substring(wallet.address.length - 4)}
              </span>
              <span className="text-xs text-polkadot-pink">{wallet.network}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectWallet}
              className="text-sm"
            >
              Disconnect
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Header;
