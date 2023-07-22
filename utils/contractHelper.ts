import {
  Abi,
  PublicClient,
  WalletClient,
  getContract as viemGetContract,
} from 'viem'
import { Address, erc20ABI } from 'wagmi'
import { ChainId } from '../constants/chains'

export const getContract = <
  TAbi extends Abi | unknown[],
  TWalletClient extends WalletClient
>({
  abi,
  address,
  chainId = ChainId.Avalanche,
  publicClient,
  signer,
}: {
  abi: TAbi
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    publicClient: publicClient,
    walletClient: signer,
  })
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getErc20Contract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: erc20ABI, address, signer })
}
