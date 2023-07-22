import { Address } from 'viem'
import { useTokenContract } from './useContract'
import useSWR from 'swr'

export default function useTokenAllowance(
  token: Address,
  owner: Address,
  spender: Address
) {
  const contract = useTokenContract(token)
  const { data: allowance, isLoading } = useSWR(
    `get_token_allowance${[token, owner, spender]}`,
    async () => {
      let result = await contract.read.allowance([owner, spender])
      return result
    },
    {
      refreshInterval: 1000,
    }
  )
  return { allowance: allowance ?? 0n, loading: isLoading }
}
