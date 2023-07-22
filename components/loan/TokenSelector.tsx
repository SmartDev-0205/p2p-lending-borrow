import * as React from 'react'
import { Box, FormControl, MenuItem, Select, Typography } from '@mui/material'
import { TokenList } from '../../constants/token'
import Image from 'next/image'
import {
  IActionSlice,
  setBorrowCollateralToken,
  setBorrowLoanToken,
  setSupCollateralToken,
  setSupLoanToken,
} from 'store/slices/action'
import { Address } from 'viem'
import { useDispatch, useSelector } from 'react-redux'
import { IReduxState } from 'store/store'
import { OrderType } from 'interfaces'
import { getTokenAddressFromName, getTokenNameFromAddress } from 'utils/token'

const TokenSelector = ({
  orderType,
  tokenType,
}: {
  orderType: OrderType
  tokenType: string
}) => {
  const dispatch = useDispatch()
  const actionState = useSelector<IReduxState, IActionSlice>(
    (state) => state.action
  )
  const init =
    orderType === OrderType.SUPPLY && tokenType === 'loan'
      ? actionState.supply.loanToken
      : orderType === OrderType.SUPPLY && tokenType === 'collateral'
      ? actionState.supply.collateralToken
      : orderType === OrderType.BORROW && tokenType === 'loan'
      ? actionState.borrow.loanToken
      : actionState.borrow.collateralToken
  const [token, setToken] = React.useState(getTokenNameFromAddress(init))

  const handleChange = (e) => {
    setToken(e.target.value as string)
    const tokenMeta = TokenList.find(
      (element) => element.name === (e.target.value as string)
    )
    if (orderType === OrderType.SUPPLY && tokenType === 'loan') {
      dispatch(setSupLoanToken({ loanToken: tokenMeta.address as Address }))
    } else if (orderType === OrderType.SUPPLY && tokenType === 'collateral') {
      dispatch(
        setSupCollateralToken({ collateralToken: tokenMeta.address as Address })
      )
    } else if (orderType === OrderType.BORROW && tokenType === 'loan') {
      dispatch(setBorrowLoanToken({ loanToken: tokenMeta.address as Address }))
    } else if (orderType === OrderType.BORROW && tokenType === 'collateral') {
      dispatch(
        setBorrowCollateralToken({
          collateralToken: tokenMeta.address as Address,
        })
      )
    }
  }

  return (
    <FormControl sx={{ minWidth: 120 }}>
      <Select
        value={token}
        onChange={(e) => {
          if (getTokenAddressFromName(e.target.value) !== '') handleChange(e)
        }}
        displayEmpty
        sx={{
          color: '#ececec',
          borderRadius: '8px',
          '&.MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#454f5b',
            },
            '&:hover fieldset': {
              borderColor: '#454f5b',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#454f5b',
            },
          },
          '& .MuiSvgIcon-root': {
            color: '#ececec',
          },
          '& .MuiSelect-select': {
            p: 0,
            gap: '3px !important',
          },
        }}
        inputProps={{
          padding: '0px !important',
        }}
      >
        {TokenList.map((token, index) => (
          <MenuItem value={token.name} key={index}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                pl: 3,
                gap: 1,
                py: 1,
              }}
            >
              <Image
                width={24}
                height={24}
                src={token.logo}
                loading="lazy"
                alt="USDT logo"
              />
              <Typography sx={{ m: '0px !important' }}>{token.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
export default TokenSelector
