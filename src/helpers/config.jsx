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

export const triggerConnectedWalletDialog = async (walletProvider) => {
  try {
      console.log("🔍 Detecting connected wallet...");
      
      // Method 1: Check provider properties (most reliable)
      let walletName = 'unknown';
      
      if (walletProvider?.isMetaMask) {
          walletName = 'metamask';
      } else if (walletProvider?.isTrust) {
          walletName = 'trust';
      } else if (walletProvider?.isRainbow) {
          walletName = 'rainbow';
      } else if (walletProvider?.isCoinbaseWallet) {
          walletName = 'coinbase';
      } else if (walletProvider?.connector?.name) {
          // Fallback to connector name
          walletName = walletProvider.connector.name.toLowerCase();
      }
      
      console.log("🎯 Detected wallet:", walletName);
      
      // Get the correct deep link
      const deepLinks = {
          'metamask': 'metamask://',
          'trust': 'trust://',
          'rainbow': 'rainbow://',
          'coinbase': 'cbwallet://',
          'imtoken': 'imtokenv2://',
          'tokenpocket': 'tpoutside://',
          'walletconnect': 'wc://'
      };
      
      const deepLink = deepLinks[walletName];
      
      if (deepLink) {
          console.log("🚀 Opening wallet with:", deepLink);
          window.location.href = deepLink;
      } else {
          console.log("⚠️ No deep link found, using fallback");
          // Fallback: try to trigger any wallet
          if (walletProvider?.request) {
              await walletProvider.request({ method: 'eth_requestAccounts' });
          }
      }
      
  } catch (error) {
      console.log("Wallet trigger error:", error);
      // Final fallback
      try {
          await walletProvider?.request({ method: 'eth_requestAccounts' });
      } catch (e) {
          console.log("All wallet triggers failed");
      }
  }
};
