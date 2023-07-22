import { isNative } from 'utils/token'
import { Address } from 'viem'
import { useAccount, useBalance } from 'wagmi'

export const useTokenBalance = (token: Address) => {
  const { address: account } = useAccount()
  const tokenAddr = (isNative(token) ? '' : token) as Address

  const balance = useBalance({
    address: account,
    token: tokenAddr,
  })

  return balance
}
