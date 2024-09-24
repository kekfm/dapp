import { Chain } from '@usedapp/core'

export const Modulus: Chain = {
  chainId: 6666,
  chainName: 'Modulus',
  isTestChain: true,
  isLocalChain: false,
  multicallAddress: '0x893E2e9B48fd46b9F8905c8869F7e8c98e223B84',
  getExplorerAddressLink: (address: string) =>`https://eye.moduluszk.io/address/${address}`,
  getExplorerTransactionLink: (transactionHash: string) =>`https://eye.moduluszk.io//tx/${transactionHash}`,
  // Optional parameters:
  rpcUrl: 'https://rpc.moduluszk.io',
  blockExplorerUrl: 'https://eye.moduluszk.io',
  nativeCurrency: {
    name: 'Cult',
    symbol: 'CULT',
    decimals: 18,
  }
}