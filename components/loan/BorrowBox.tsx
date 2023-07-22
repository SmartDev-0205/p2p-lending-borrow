import { Box, Typography } from '@mui/material'
import * as React from 'react'
import TokenSelector from './TokenSelector'
import { StyledTextField } from '../styled/CustomTextField'
import { useDispatch, useSelector } from 'react-redux'
import { IReduxState } from 'store/store'
import {
  IActionSlice,
  setBorrowCollateralAmount,
  setBorrowLoanAmount,
} from 'store/slices/action'
import { getTokenNameFromAddress } from 'utils/token'
import { OrderType } from 'interfaces'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { trim } from 'utils/trim'
const BorrowBox = () => {
  const dispatch = useDispatch()
  const actionState = useSelector<IReduxState, IActionSlice>(
    (state) => state.action
  )

  const balance = useTokenBalance(actionState.borrow.collateralToken)
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Typography>Collateral Amount</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '& .MuiTypography-root': {
              fontSize: { md: '13px !important' },
              color: '#9597a1',
            },
          }}
        >
          <Typography>Balance: </Typography>
          <Typography>
            {trim(Number(balance.data?.formatted ?? '0'))}{' '}
            {getTokenNameFromAddress(actionState.borrow.collateralToken)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          border: '1px solid #454f5b',
          px: '10px',
          py: 1,
          borderRadius: '10px',
        }}
      >
        <TokenSelector orderType={OrderType.BORROW} tokenType="collateral" />
        <StyledTextField
          value={actionState.borrow.collateralAmount}
          onChange={(e) => {
            dispatch(
              setBorrowCollateralAmount({
                collateralAmount: e.target.value,
              })
            )
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Typography>Loan Amount</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '& .MuiTypography-root': {
              fontSize: { md: '13px !important' },
              color: '#9597a1',
            },
          }}
        >
          {/* <Typography>1 USDC =</Typography>
          <Typography>0.99</Typography>
          <Typography>$</Typography> */}
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          border: '1px solid #454f5b',
          px: '10px',
          py: 1,
          borderRadius: '10px',
        }}
      >
        <TokenSelector orderType={OrderType.BORROW} tokenType="loan" />
        <StyledTextField
          value={actionState.borrow.loanAmount}
          onChange={(e) => {
            dispatch(setBorrowLoanAmount({ loanAmount: e.target.value }))
          }}
        />
      </Box>
    </Box>
  )
}
export default BorrowBox
