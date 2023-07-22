import { useMemo, useCallback } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import useTokenAllowance from './useTokenAllowance'
import { getProtocolAddress } from 'utils/addressHelpers'
import { isNative } from 'utils/token'
import { useTokenContract } from './useContract'
import { calculateGasMargin } from 'utils'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { SendTransactionResult } from 'wagmi/dist/actions'
import { useDispatch } from 'react-redux'
import { clearPendingTxn, fetchPendingTxns } from 'store/slices/pendingTxs'
import { publicClient } from 'utils/viem'
import { useHasPendingApproval } from './usePendingTxs'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

export function useApproveCallback(
  token: Address,
  amountToApprove: bigint,
  spender: Address
): [ApprovalState, () => Promise<void | SendTransactionResult>] {
  const { address: account } = useAccount()
  const { allowance } = useTokenAllowance(token, account, getProtocolAddress())
  const pendingApproval = useHasPendingApproval(token, spender)
  const dispatch = useDispatch()

  const approvalState = useMemo(() => {
    if (!amountToApprove || !spender || !token) return ApprovalState.UNKNOWN
    if (isNative(token)) return ApprovalState.APPROVED

    return allowance < amountToApprove
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, spender, token, allowance, pendingApproval])

  const tokenContract = useTokenContract(token)
  const { callWithGasPrice } = useCallWithGasPrice()

  const approve = useCallback(async () => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return undefined
    }
    if (!token) {
      console.error('no token')
    }
    if (!tokenContract) {
      console.error('tokenContract is null')
      return undefined
    }
    if (!amountToApprove) {
      console.error('missing amount to approve')
      return undefined
    }
    if (!spender) {
      console.error('no spender')
      return undefined
    }

    if (!account) {
      console.log('connect wallet')
      return undefined
    }

    const safeGasEstimate = calculateGasMargin(
      await tokenContract.estimateGas['approve']([spender, amountToApprove], {
        account: tokenContract.account,
      })
    )
    if (!safeGasEstimate) return undefined

    return callWithGasPrice(
      tokenContract,
      'approve' as const,
      [spender, amountToApprove],
      { gas: safeGasEstimate }
    )
      .then(async (response) => {
        dispatch(
          fetchPendingTxns({
            txHash: response.hash,
            type: `approve-${token}-${spender}`,
          })
        )
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: response.hash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(response.hash))
        }
      })
      .catch((error: any) => {
        console.error('Failed to approve token', error)
      })
  }, [
    account,
    approvalState,
    token,
    tokenContract,
    amountToApprove,
    spender,
    callWithGasPrice,
  ])

  return [approvalState, approve]
}
