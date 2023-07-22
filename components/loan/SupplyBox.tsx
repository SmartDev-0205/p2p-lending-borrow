import { Box, Typography } from '@mui/material'
import * as React from 'react'
import TokenSelector from './TokenSelector'
import { StyledTextField } from '../styled/CustomTextField'
import {
  setSupLoanAmount,
  setSupCollateralAmount,
  IActionSlice,
} from 'store/slices/action'
import { useDispatch, useSelector } from 'react-redux'
import { IReduxState } from 'store/store'
import { getTokenNameFromAddress } from 'utils/token'

import { useTokenBalance } from 'hooks/useTokenBalance'
import { trim } from 'utils/trim'
import { OrderType } from 'interfaces'

const SupplyBox = () => {
  const dispatch = useDispatch()
  const actionState = useSelector<IReduxState, IActionSlice>(
    (state) => state.action
  )

  const balance = useTokenBalance(actionState.supply.loanToken)

  return (
    <Box>
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
          <Typography>Balance:</Typography>
          <Typography>
            {trim(Number(balance.data?.formatted ?? '0'))}{' '}
            {getTokenNameFromAddress(actionState.supply.loanToken)}
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          gap: 1,
          border: '1px solid #454f5b',
          px: '10px',
          py: 1,
          borderRadius: '10px',
        }}
      >
        <TokenSelector orderType={OrderType.SUPPLY} tokenType="loan" />
        <StyledTextField
          value={actionState.supply.loanAmount}
          onChange={(e) => {
            dispatch(setSupLoanAmount({ loanAmount: e.target.value }))
          }}
        />
      </Box>
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
          gap: 1,
          border: '1px solid #454f5b',
          px: '10px',
          py: 1,
          borderRadius: '10px',
        }}
      >
        <TokenSelector orderType={OrderType.SUPPLY} tokenType="collateral" />
        <StyledTextField
          value={actionState.supply.collateralAmount}
          onChange={(e) => {
            dispatch(
              setSupCollateralAmount({
                collateralAmount: e.target.value,
              })
            )
          }}
        />
        {/* <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '2px solid rgb(0, 247, 167)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
        >
          <Typography
            sx={{
              my: '0px !important',
              color: 'white',
              fontSize: '10px',
            }}
          >
            0%
          </Typography>
        </Box> */}
      </Box>
    </Box>
  )
}
export default SupplyBox
