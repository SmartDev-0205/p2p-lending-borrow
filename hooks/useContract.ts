import { Abi, Address, multicall3Abi } from 'viem'
import { erc20ABI, useChainId, useWalletClient } from 'wagmi'
import { useMemo } from 'react'
import { getContract } from '../utils/contractHelper'
import {
  getMulticallAddress,
  getProtocolAddress,
} from '../utils/addressHelpers'
import { ProtocolABI } from '../constants/abi/protocol'
import { publicClient } from 'utils/viem'

export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi
) {
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient,
        publicClient: publicClient,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export const useERC20 = (address: Address) => {
  return useContract(address, erc20ABI)
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20ABI)
}

export function useMulticallContract() {
  const chainId = useChainId()
  return useContract(getMulticallAddress(chainId), multicall3Abi)
}

export function useProtocolContract() {
  const chainId = useChainId()
  return useContract(getProtocolAddress(chainId), ProtocolABI)
}
