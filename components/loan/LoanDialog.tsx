import { useMemo } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {
  Typography,
  Dialog,
  Box,
  Button,
  CircularProgress,
} from '@mui/material'
import DatePicker from '../styled/DatePicker'

import { useState } from 'react'

import LoanDetail from './LoanDetail'
import {
  IActionSlice,
  createBorrowOrder,
  createSupplyOrder,
} from '../../store/slices/action'
import SupplyBox from './SupplyBox'
import BorrowBox from './BorrowBox'

import { IReduxState, useAppDispatch } from '../../store/store'
import { useAccount } from 'wagmi'
import { useProtocolContract } from 'hooks/useContract'
import { useSelector } from 'react-redux'
import { DatePickerType, OrderType } from 'interfaces'

import { getProtocolAddress } from 'utils/addressHelpers'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { parseUnits } from 'viem'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { usePendingTxs } from 'hooks/usePendingTxs'
import { isPendingTxn } from 'store/slices/pendingTxs'
import { getDecimals } from 'utils/token'

interface IOpenProps {
  open: boolean
  handleClose: () => void
}

export default function LoanDialog({ open, handleClose }: IOpenProps) {
  const [view, setview] = useState('supply')

  const dispatch = useAppDispatch()
  const { address: account } = useAccount()
  const protocolContract = useProtocolContract()
  const pendingTxs = usePendingTxs()

  const actionState = useSelector<IReduxState, IActionSlice>(
    (state) => state.action
  )

  const [approvalState, approve] = useApproveCallback(
    view === 'supply'
      ? actionState.supply.loanToken
      : actionState.borrow.collateralToken,
    view === 'supply'
      ? parseUnits(
          actionState.supply.loanAmount,
          getDecimals(actionState.supply.loanToken)
        )
      : parseUnits(
          actionState.borrow.collateralAmount,
          getDecimals(actionState.borrow.collateralToken)
        ),
    getProtocolAddress()
  )

  const createOrder = async () => {
    if (view === 'supply') {
      dispatch(
        createSupplyOrder({
          account,
          protocolContract,
          loanToken: actionState.supply.loanToken,
          loanAmount: actionState.supply.loanAmount,
          collateralToken: actionState.supply.collateralToken,
          collateralAmount: actionState.supply.collateralAmount,
          lenderFee:
            (Number(actionState.supply.loanAmount) *
              Number(actionState.supply.lenderFee)) /
            100,
          timestamps: [
            actionState.supply.startTimestamp / 1000,
            actionState.supply.endTimestamp / 1000,
          ],
        })
      )
    } else {
      dispatch(
        createBorrowOrder({
          account,
          protocolContract,
          loanToken: actionState.borrow.loanToken,
          loanAmount: actionState.borrow.loanAmount,
          collateralToken: actionState.borrow.collateralToken,
          collateralAmount: actionState.borrow.collateralAmount,
          lenderFee:
            (Number(actionState.borrow.loanAmount) *
              Number(actionState.supply.lenderFee)) /
            100,
          timestamps: [
            actionState.borrow.startTimestamp / 1000,
            actionState.borrow.endTimestamp / 1000,
          ],
        })
      )
    }
  }

  const loading = useMemo(() => {
    if (view === 'supply') {
      return (
        isPendingTxn(
          pendingTxs,
          `createSupplyOrder-${actionState.supply.loanToken}-${actionState.supply.collateralToken}`
        ) || approvalState === ApprovalState.PENDING
      )
    } else if (view === 'borrow') {
      return (
        isPendingTxn(
          pendingTxs,
          `createBorrowOrder-${actionState.borrow.loanToken}-${actionState.borrow.collateralToken}`
        ) || approvalState === ApprovalState.PENDING
      )
    }
  }, [view, actionState, pendingTxs, approvalState])

  const [submitTxt, handleSumbit] = useMemo(() => {
    const submitTxt =
      approvalState === ApprovalState.PENDING
        ? 'Approving'
        : approvalState === ApprovalState.APPROVED
        ? 'Create Order'
        : 'Approve & Create Order'

    if (approvalState === ApprovalState.APPROVED)
      return [submitTxt, createOrder]
    else return [submitTxt, approve]
  }, [approvalState, actionState])

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      PaperProps={{
        style: {
          backgroundColor: '#1f304a',
          boxShadow: 'none',
          borderRadius: '15px',
          color: '#ececec',
          padding: '10px 20px',
        },
      }}
      scroll={'body'}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography p={1} sx={{ fontSize: { xs: '2.2vw', md: '20px' } }}>
          Create {view === 'supply' ? 'Supply' : 'Borrow'} Loan
        </Typography>
        <CloseIcon onClick={handleClose} sx={{ cursor: 'pointer' }} />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          mt: 3,
          mx: 4,
        }}
      >
        <Button
          value="supply"
          onClick={() => setview('supply')}
          sx={{
            backgroundColor: view === 'supply' ? '#182539 !important' : '',
          }}
        >
          Supply
        </Button>

        <Button
          value="borrow"
          onClick={() => setview('borrow')}
          sx={{
            backgroundColor: view === 'borrow' ? '#182539 !important' : '',
          }}
        >
          Borrow
        </Button>
      </Box>
      <Box
        sx={{
          '& .MuiTypography-root': {
            mt: 2,
            mb: 0.5,
            fontSize: { xs: '15px', md: '15px' },
            letterSpacing: 1,
          },
        }}
      >
        {view === 'supply' ? <SupplyBox /> : <BorrowBox />}
        <Typography ml={2} mb={0.5}>
          The repayment period for this credit starts on:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <DatePicker
            pickerType={DatePickerType.START}
            orderType={view === 'supply' ? OrderType.SUPPLY : OrderType.BORROW}
          />
        </Box>
        <Typography ml={2} mb={0.5}>
          Ends on:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <DatePicker
            pickerType={DatePickerType.END}
            orderType={view === 'supply' ? OrderType.SUPPLY : OrderType.BORROW}
          />
        </Box>
      </Box>

      <LoanDetail
        orderType={view === 'supply' ? OrderType.SUPPLY : OrderType.BORROW}
      />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          whiteSpace: 'nowrap',
          mb: 1,
          mt: 2,
          mx: 3,
        }}
      >
        <Button
          onClick={() => {
            if (loading) return
            handleSumbit()
          }}
        >
          {submitTxt}
          {loading && (
            <CircularProgress sx={{ color: 'white', ml: 2 }} size={20} />
          )}
        </Button>
      </Box>
    </Dialog>
  )
}
