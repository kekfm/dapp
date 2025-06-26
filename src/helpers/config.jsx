import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import { mainnet, arbitrum, sepolia, base, bscTestnet } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID  // this is a public projectId only to use on localhost

const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'Kek',
    description: 'Kek',
    url: window.location.origin, // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const modulus = defineChain({
    id: 6666,
    caipNetworkId: 'eip155:6666',
    chainNamespace: 'eip155',
    name: 'Modulus',
    nativeCurrency: {
      decimals: 18,
      name: 'Cult',
      symbol: 'CULT',
    },
    rpcUrls: {
      default: {
        http: ['https://rpc.moduluszk.io'],
      },
    },
    blockExplorers: {
      default: { name: 'Modulus Eye', url: 'https://eye.moduluszk.io/' },
    }
})

// Include standard networks that your Connect component expects
export const networks = [modulus, mainnet, base, bscTestnet] 

export const ethersAdapter = new EthersAdapter({
  projectId,
  networks
})

// Create AppKit instance
export const appkit = createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId,
  metadata,
  defaultChain: modulus,
  features: {
    analytics: true,
    email: false,
    socials: [],
    emailShowWallets: false
  },
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true
})

// Provider component for AppKit
export function AppKitProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

// 2. Add manual iOS dialog trigger function

// Replace your triggerConnectedWalletDialog with this:
export const triggerConnectedWalletDialog = async (walletProvider) => {
  try {
      console.log("🔍 Triggering wallet connection...");
      
      // Method 1: Use AppKit's built-in mobile handling
      if (window.appkit) {
          console.log("🚀 Using AppKit modal...");
          window.appkit.open({ view: 'Account' });
          return;
      }
      
      // Method 2: Force account request (most reliable)
      if (walletProvider?.request) {
          console.log("🚀 Using provider request...");
          await walletProvider.request({ 
              method: 'eth_requestAccounts' 
          });
          return;
      }
      
      // Method 3: Try window.ethereum
      if (window.ethereum?.request) {
          console.log("🚀 Using window.ethereum...");
          await window.ethereum.request({ 
              method: 'eth_requestAccounts' 
          });
          return;
      }
      
      console.log("⚠️ No wallet trigger method available");
      
  } catch (error) {
      console.log("Wallet trigger error:", error);
      
      // Fallback: Don't trigger anything, let transaction proceed
      // The transaction itself will trigger MetaMask
      console.log("🔄 Letting transaction trigger wallet naturally...");
  }
};
