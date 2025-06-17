import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, sepolia } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from '@reown/appkit/networks';


// Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const metadata = {
    name: 'AppKit',
    description: 'AppKit Example',
    url: 'http://localhost:5173', // origin must match your domain & subdomain
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
export const networks = [modulus] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig