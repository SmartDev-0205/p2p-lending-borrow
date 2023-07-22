import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { Address, Hash, parseUnits } from 'viem'
import { publicClient } from '../../utils/viem'
import { calculateGasMargin } from '../../utils'
import { RootState } from '../store'
import { OrderType } from 'interfaces'
import { useProtocolContract } from 'hooks/useContract'
import { clearPendingTxn, fetchPendingTxns } from './pendingTxs'
import { getDecimals } from 'utils/token'

export type IProtocolContract = ReturnType<typeof useProtocolContract>

interface ICreateOrder {
  account: Address
  protocolContract: IProtocolContract
  loanToken: Address
  loanAmount: string
  collateralToken: Address
  collateralAmount: string
  lenderFee: number
  timestamps: number[]
}

export const createSupplyOrder = createAsyncThunk(
  'action/createSupplyOrder',
  async (
    {
      account,
      protocolContract,
      loanToken,
      loanAmount,
      collateralToken,
      collateralAmount,
      lenderFee,
      timestamps,
    }: ICreateOrder,
    { dispatch }
  ) => {
    const gasPrice = await publicClient.getGasPrice()

    let args: any = [
      loanToken,
      parseUnits(loanAmount, getDecimals(loanToken)),
      collateralToken,
      parseUnits(collateralAmount, getDecimals(collateralToken)),
      parseUnits(String(lenderFee), getDecimals(loanToken)),
      timestamps,
      OrderType.SUPPLY,
    ]

    const safeGasEstimate = calculateGasMargin(
      await protocolContract.estimateGas['newOrder'](args, { account })
    )

    let txHash = undefined
    try {
      await protocolContract.write
        .newOrder(args, {
          gasPrice,
          gasLimit: safeGasEstimate,
        })
        .then((response: Hash) => {
          txHash = response
          dispatch(
            fetchPendingTxns({
              txHash,
              type: `createSupplyOrder-${loanToken}-${collateralToken}`,
            })
          )
        })
    } catch (err) {
      console.log(err)
    } finally {
      if (txHash) {
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(txHash))
        }
      }
    }
  }
)

export const createBorrowOrder = createAsyncThunk(
  'action/createBorrowOrder',
  async (
    {
      account,
      protocolContract,
      loanToken,
      loanAmount,
      collateralToken,
      collateralAmount,
      lenderFee,
      timestamps,
    }: ICreateOrder,
    { dispatch }
  ) => {
    const gasPrice = await publicClient.getGasPrice()

    let args: any = [
      loanToken,
      parseUnits(loanAmount, getDecimals(loanToken)),
      collateralToken,
      parseUnits(collateralAmount, getDecimals(collateralToken)),
      parseUnits(String(lenderFee), getDecimals(loanToken)),
      timestamps,
      OrderType.BORROW,
    ]

    const safeGasEstimate = calculateGasMargin(
      await protocolContract.estimateGas['newOrder'](args, { account })
    )
    let txHash = undefined
    try {
      await protocolContract.write
        .newOrder(args, {
          gasPrice,
          gasLimit: safeGasEstimate,
        })
        .then((response: Hash) => {
          txHash = response
          dispatch(
            fetchPendingTxns({
              txHash,
              type: `createBorrowOrder-${loanToken}-${collateralToken}`,
            })
          )
        })
    } catch (err) {
      console.log(err)
    } finally {
      if (txHash) {
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(txHash))
        }
      }
    }
  }
)

export const getOrder = createAsyncThunk(
  'action/getOrders',
  async (
    {
      account,
      protocolContract,
      orderId,
    }: {
      account: Address
      protocolContract: IProtocolContract
      orderId: bigint
    },
    { dispatch }
  ) => {
    const gasPrice = await publicClient.getGasPrice()

    const safeGasEstimate = calculateGasMargin(
      await protocolContract.estimateGas['getOrder']([orderId], { account })
    )
    let txHash = undefined
    try {
      await protocolContract.write
        .getOrder([orderId], {
          gasPrice,
          gasLimit: safeGasEstimate,
        })
        .then((response: Hash) => {
          txHash = response
          dispatch(
            fetchPendingTxns({
              txHash,
              type: `getOrder-${Number(orderId)}`,
            })
          )
        })
    } catch (err) {
      console.log(err)
    } finally {
      if (txHash) {
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(txHash))
        }
      }
    }
  }
)

export const liquidateOrder = createAsyncThunk(
  'action/liquidate',
  async (
    {
      account,
      protocolContract,
      orderId,
    }: {
      account: Address
      protocolContract: IProtocolContract
      orderId: bigint
    },
    { dispatch }
  ) => {
    const gasPrice = await publicClient.getGasPrice()

    const safeGasEstimate = calculateGasMargin(
      await protocolContract.estimateGas['liquidateOrder']([orderId], {
        account,
      })
    )

    let txHash: Hash = undefined
    try {
      await protocolContract.write
        .liquidateOrder([orderId], {
          gasPrice,
          gasLimit: safeGasEstimate,
        })
        .then((response: Hash) => {
          txHash = response
          dispatch(
            fetchPendingTxns({
              txHash,
              type: `order-${Number(orderId)}`,
            })
          )
        })
    } catch (err) {
      console.log(err)
    } finally {
      if (txHash) {
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(txHash))
        }
      }
    }
  }
)
export const cancelOrder = createAsyncThunk(
  'action/cancel',
  async (
    {
      account,
      protocolContract,
      orderId,
    }: {
      account: Address
      protocolContract: IProtocolContract
      orderId: bigint
    },
    { dispatch }
  ) => {
    const gasPrice = await publicClient.getGasPrice()

    const safeGasEstimate = calculateGasMargin(
      await protocolContract.estimateGas['cancelOrder']([orderId], { account })
    )

    let txHash = undefined
    try {
      await protocolContract.write
        .cancelOrder([orderId], {
          gasPrice,
          gasLimit: safeGasEstimate,
        })
        .then((response: Hash) => {
          txHash = response
          dispatch(
            fetchPendingTxns({
              txHash,
              type: `order-${Number(orderId)}`,
            })
          )
        })
    } catch (err) {
      console.log(err)
    } finally {
      if (txHash) {
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(txHash))
        }
      }
    }
  }
)
export const repayOrder = createAsyncThunk(
  'action/repay',
  async (
    {
      account,
      protocolContract,
      orderId,
    }: {
      account: Address
      protocolContract: IProtocolContract
      orderId: bigint
    },
    { dispatch }
  ) => {
    const gasPrice = await publicClient.getGasPrice()

    const safeGasEstimate = calculateGasMargin(
      await protocolContract.estimateGas['repayOrder']([orderId], { account })
    )

    let txHash = undefined
    try {
      await protocolContract.write
        .repayOrder([orderId], {
          gasPrice,
          gasLimit: safeGasEstimate,
        })
        .then((response: Hash) => {
          txHash = response
          dispatch(
            fetchPendingTxns({
              txHash,
              type: `order-${Number(orderId)}`,
            })
          )
        })
    } catch (err) {
      console.log(err)
    } finally {
      if (txHash) {
        const transaction = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })
        if (transaction.status === 'success') {
          dispatch(clearPendingTxn(txHash))
        }
      }
    }
  }
)

const now = Date.now()

const initialState = {
  supply: {
    loanToken: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    loanAmount: '0',
    collateralToken: '0xc7198437980c041c805a1edcba50c1ce5db95118',
    collateralAmount: '0',
    lenderFee: 0,
    startTimestamp: now + 60 * 60 * 1000 * 3,
    endTimestamp: now + 60 * 60 * 24 * 1000 * 7,
  },
  borrow: {
    loanToken: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    loanAmount: '0',
    collateralToken: '0xc7198437980c041c805a1edcba50c1ce5db95118',
    collateralAmount: '0',
    lenderFee: 0,
    startTimestamp: now,
    endTimestamp: now + 60 * 60 * 24 * 1000 * 7,
  },
}

export interface IActionSlice {
  supply: {
    loanToken: Address
    loanAmount: string
    collateralToken: Address
    collateralAmount: string
    lenderFee: number
    startTimestamp: number
    endTimestamp: number
  }
  borrow: {
    loanToken: Address
    loanAmount: string
    collateralToken: Address
    collateralAmount: string
    startTimestamp: number
    endTimestamp: number
  }
}

const actionSlice = createSlice({
  name: 'action',
  initialState,
  reducers: {
    setSupLoanToken(state, action: { payload: { loanToken: Address } }) {
      state.supply.loanToken = action.payload.loanToken
    },
    setSupLoanAmount(state, action: { payload: { loanAmount: string } }) {
      state.supply.loanAmount = action.payload.loanAmount
    },
    setSupCollateralToken(
      state,
      action: { payload: { collateralToken: Address } }
    ) {
      state.supply.collateralToken = action.payload.collateralToken
    },
    setSupCollateralAmount(
      state,
      action: { payload: { collateralAmount: string } }
    ) {
      state.supply.collateralAmount = action.payload.collateralAmount
    },
    setSupLenderFee(state, action: { payload: { lenderFee: number } }) {
      state.supply.lenderFee = action.payload.lenderFee
    },
    setSupStartTimestamp(state, action: { payload: { timestamp: number } }) {
      state.supply.startTimestamp = action.payload.timestamp
    },
    setSupEndTimestamp(state, action: { payload: { timestamp: number } }) {
      state.supply.endTimestamp = action.payload.timestamp
    },
    setBorrowLoanToken(state, action: { payload: { loanToken: Address } }) {
      state.borrow.loanToken = action.payload.loanToken
    },
    setBorrowLoanAmount(state, action: { payload: { loanAmount: string } }) {
      state.borrow.loanAmount = action.payload.loanAmount
    },
    setBorrowCollateralToken(
      state,
      action: { payload: { collateralToken: Address } }
    ) {
      state.borrow.collateralToken = action.payload.collateralToken
    },
    setBorrowCollateralAmount(
      state,
      action: { payload: { collateralAmount: string } }
    ) {
      state.borrow.collateralAmount = action.payload.collateralAmount
    },
    setBorrowStartTimestamp(state, action: { payload: { timestamp: number } }) {
      state.borrow.startTimestamp = action.payload.timestamp
    },
    setBorrowEndTimestamp(state, action: { payload: { timestamp: number } }) {
      state.borrow.endTimestamp = action.payload.timestamp
    },
  },
})

const baseInfo = (state: RootState) => state.action
export default actionSlice.reducer

export const {
  setSupLoanToken,
  setSupLoanAmount,
  setSupCollateralToken,
  setSupCollateralAmount,
  setSupLenderFee,
  setSupStartTimestamp,
  setSupEndTimestamp,
  setBorrowLoanToken,
  setBorrowLoanAmount,
  setBorrowCollateralToken,
  setBorrowCollateralAmount,
  setBorrowStartTimestamp,
  setBorrowEndTimestamp,
} = actionSlice.actions

export const getActionState = createSelector(baseInfo, (action) => action)
