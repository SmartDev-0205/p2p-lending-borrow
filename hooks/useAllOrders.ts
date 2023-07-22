import { useProtocolContract } from './useContract'
import useSWR from 'swr'

export const useAllOrders = () => {
  const contract = useProtocolContract()
  const { data: orders, isLoading } = useSWR(
    'get_orders',
    async () => {
      const _orders = await contract.read.getAllOrders()
      return _orders
    },
    {
      refreshInterval: 2000,
    }
  )

  return { orders, loading: isLoading }
}
