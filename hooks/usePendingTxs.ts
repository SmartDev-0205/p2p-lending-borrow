import { useSelector } from 'react-redux'
import { IPendingTxn, isPendingTxn } from 'store/slices/pendingTxs'
import { IReduxState } from 'store/store'
import { Address } from 'viem'

export const usePendingTxs = () => {
  const pendingTxs = useSelector<IReduxState, Array<IPendingTxn>>(
    (state) => state.pendingTransactions
  )
  return pendingTxs
}

export const useHasPendingApproval = (token: Address, spender: Address) => {
  const pendingTxs = useSelector<IReduxState, Array<IPendingTxn>>(
    (state) => state.pendingTransactions
  )
  return isPendingTxn(pendingTxs, `approve-${token}-${spender}`)
}
