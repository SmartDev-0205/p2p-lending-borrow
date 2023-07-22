import { Box, Typography } from '@mui/material'
import Image from 'next/image'

export default function TokenAmountBox({ logo, amount, symbol }) {
  return (
    <Box>
      <Image src={logo} width={20} height={20} alt="token_logo" />
      <Typography ml={1}>{amount}</Typography>
      <Typography ml={0.5}>{symbol}</Typography>
    </Box>
  )
}
