import { ChainId } from '../constants/chains'
import addresses from '../constants/addresses'

export interface Addresses {
  [chainId: number]: `0x${string}`
}

export const getAddressFromMap = (
  address: Addresses,
  chainId?: number
): `0x${string}` => {
  return address[chainId] ? address[chainId] : address[ChainId.Avalanche]
}

export const getMulticallAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.multiCall as Addresses, chainId)
}

export const getProtocolAddress = (chainId?: number) => {
  return getAddressFromMap(addresses.protocol as Addresses, chainId)
}
