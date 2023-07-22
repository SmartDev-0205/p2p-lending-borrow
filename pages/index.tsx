'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Box, Divider, FormControlLabel, Grid, Typography } from '@mui/material'
import * as React from 'react'
import Button from '@mui/material/Button'
import { Container } from '@mui/material'
import OrderTable from '../components/OrderTable'
import LoanDialog from '../components/loan/LoanDialog'
import CustomCheckBox from '../components/styled/CheckBox'
import OrderFilter from '../components/OrdersFilter'
import Image from 'next/image'
import { useAllOrders } from 'hooks/useAllOrders'
import { Order } from 'interfaces'
import { getDecimals, getTokenNameFromAddress } from 'utils/token'

const Index = () => {
  //dialog

  const [visible, setVisible] = useState(false)

  const [filter, setFilter] = useState<{
    loanToken: string
    collateralToken: string
    orderType: number
  }>({
    loanToken: null,
    collateralToken: null,
    orderType: null,
  })

  const { orders, loading } = useAllOrders()
  const sortedOrders = useMemo(() => {
    let _orders = orders?.filter((order) => {
      if (
        filter.loanToken &&
        getTokenNameFromAddress(order.loanToken) !== filter.loanToken
      )
        return false
      else if (
        filter.collateralToken &&
        getTokenNameFromAddress(order.collateralToken) !==
          filter.collateralToken
      )
        return false
      else if (filter.orderType !== null && order.role !== filter.orderType)
        return false
      else return true
    })
    return _orders
  }, [filter, orders])

  return (
    <>
      <Container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          mt: 2,
          width: '100%',
          fontFamily: 'Rubik',
          overflow: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: { xs: 1, md: 4 },
                  flexWrap: 'wrap',
                  p: { xs: 1, md: 2 },
                  bgcolor: '#1c2c42',
                  borderRadius: 5,

                  '& .MuiBox-root': {
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Image
                    src="https://twopaws.io/token-icons/default.png"
                    alt="img"
                    width={30}
                    height={30}
                  />
                  <OrderFilter
                    tokenType="loan"
                    filter={filter}
                    setFilter={setFilter}
                  />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <Image
                    src="https://twopaws.io/token-icons/default.png"
                    alt="img"
                    width={30}
                    height={30}
                  />
                  <OrderFilter
                    tokenType="collateral"
                    filter={filter}
                    setFilter={setFilter}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: { xs: 1, md: 3 },
                  p: 2,
                  bgcolor: '#1c2c42',
                  minHeight: '68px !important',
                  borderRadius: 5,
                  '& .MuiButton-root': {
                    whiteSpace: 'nowrap',
                    padding: 'auto 20px',
                    maxWidth: '140px',
                  },
                }}
              >
                <Link href="/">
                  <Button variant="outlined">Orders Book</Button>
                </Link>
                <Link href="./account">
                  <Button variant="outlined">My Account</Button>
                </Link>
                <Button variant="outlined" onClick={() => setVisible(true)}>
                  New Loan
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Box
          mt={4}
          sx={{
            width: '100%',
            minHeight: '80vh',
            borderRadius: '20px',
            bgcolor: 'rgb(31, 48, 74)',
            border: '1px solid #141e2f',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              px: 3,
              alignItems: 'center',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontSize: '25px', mt: 1 }}>
                Supply Market
              </Typography>
              <Typography
                sx={{ fontSize: '12px', color: 'rgb(149, 151, 161)' }}
              >
                The escrow loan has already been added to the protocol.
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
                py: 2,
                '& .MuiButton-root': {
                  minWidth: '100px',
                },
              }}
            >
              <FormControlLabel
                control={<CustomCheckBox />}
                label="History"
                labelPlacement="start"
              />
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  '& .MuiButton-root': {
                    width: 'fit-content',
                    '&:hover': {
                      borderColor: '#454f5b',
                    },
                  },
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setFilter({ ...filter, orderType: 0 })}
                >
                  Supply
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setFilter({ ...filter, orderType: 1 })}
                >
                  Borrow
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setFilter({ ...filter, orderType: null })}
                >
                  All
                </Button>
              </Box>
            </Box>
          </Box>
          <Divider sx={{ bgcolor: '#141e2f', p: '0.2px' }} />
          <OrderTable orders={sortedOrders as Array<Order>} />
        </Box>
        <LoanDialog open={visible} handleClose={() => setVisible(false)} />
      </Container>
    </>
  )
}

export default Index
