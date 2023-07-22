import { UserRejectedRequestError, UnknownRpcError } from 'viem'

const possibleRejectMessage = [
  'Cancelled by User',
  'cancel',
  'Transaction was rejected',
]

// provider user rejected error code
export const isUserRejected = (err) => {
  if (err instanceof UserRejectedRequestError) {
    return true
  }
  if (err instanceof UnknownRpcError) {
    // fallback for some wallets that don't follow EIP 1193, trust, safe
    if (possibleRejectMessage.some((msg) => err.details?.includes(msg))) {
      return true
    }
  }

  // fallback for raw rpc error code
  if (typeof err === 'object') {
    if (
      ('code' in err &&
        (err.code === 4001 || err.code === 'ACTION_REJECTED')) ||
      ('cause' in err && 'code' in err.cause && err.cause.code === 4001)
    ) {
      return true
    }

    if ('cause' in err) {
      return isUserRejected(err.cause)
    }
  }
  return false
}

const ENABLED_LOG = false
