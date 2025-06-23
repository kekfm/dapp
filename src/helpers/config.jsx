import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks';
import { createAppKit } from '@reown/appkit/react'



// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Detect if running in Telegram WebApp
const isTelegramWebApp = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData;

// Set the correct URL based on environment
const getAppUrl = () => {
  if (typeof window === 'undefined') return 'https://localhost:5173'; // SSR fallback
  
  if (isTelegramWebApp) {
    // For Telegram mini apps, use your actual domain instead of window.location.origin
    return 'https://kek.fm'; // Replace with your actual domain
  }
  
  return window.location.origin;
};

export const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: getAppUrl(),
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

// for custom networks visit -> https://docs.reown.com/appkit/react/core/custom-networks
export const networks = [modulus] 

export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

// Create AppKit instance
export const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true,
    email: false, // default to true
    socials: [],
    emailShowWallets: false,
    // Add specific features for Telegram mini app compatibility
    allWallets: isTelegramWebApp ? 'HIDE' : 'SHOW', // Hide wallet selector in Telegram
    onramp: false // Disable onramp in Telegram for better UX
  },
  // Add allowUnsafeOrigin for Telegram WebApp
  allowUnsafeOrigin: isTelegramWebApp,
  
  // Add custom theme for better Telegram integration
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#000000',
    '--w3m-border-radius-master': '8px'
  }
})

// Telegram WebApp initialization
export const initializeTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Expand the WebApp to full height
    tg.expand();
    
    // Enable closing confirmation
    tg.enableClosingConfirmation();
    
    // Set theme
    tg.setHeaderColor('#000000');
    tg.setBackgroundColor('#ffffff');
    
    // Ready the WebApp
    tg.ready();
    
    console.log('Telegram WebApp initialized:', {
      user: tg.initDataUnsafe?.user,
      start_param: tg.initDataUnsafe?.start_param,
      version: tg.version,
      platform: tg.platform
    });
    
    return tg;
  }
  return null;
};

//Set up the Wagmi Adapter (Config)

export const config = wagmiAdapter.wagmiConfig