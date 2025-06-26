import "/globals.css"

export default function WalletInstructionModal({ isOpen, onClose, walletName = "wallet" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black opacity-70" onClick={onClose}></div>

            {/* Modal */}
            <div className="relative bg-base-4 connectbox border-4 border-black py-6 px-8 z-50 max-w-sm w-full mx-4">
                <div className="text-center">
                    <div className="font-basic text-2xl font-bold pb-4">
                        🔐 Action Required
                    </div>
                    
                    <div className="font-basic text-lg pb-4">
                        Please open your {walletName} to sign the transaction
                    </div>
                    
                    <div className="font-basic text-sm text-gray-600 pb-6">
                        Switch to your wallet app → Approve the transaction → Return here
                    </div>
                    
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                // Try to open MetaMask (fallback)
                                try {
                                    window.location.href = 'metamask://';
                                } catch (e) {
                                    console.log("Could not open wallet automatically");
                                }
                            }}
                            className="font-basic bg-base-7 connectbox border-2 border-black py-2 px-4 hover:scale-105 transition-transform"
                        >
                            Open Wallet App
                        </button>
                        
                        <button
                            onClick={onClose}
                            className="font-basic bg-base-8 connectbox border-2 border-black py-2 px-4 text-sm hover:scale-105 transition-transform"
                        >
                            Cancel Transaction
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 