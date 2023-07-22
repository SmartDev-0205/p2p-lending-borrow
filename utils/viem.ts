import { createPublicClient, http } from 'viem'
import { avalanche } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: avalanche,
  transport: http(),
})
