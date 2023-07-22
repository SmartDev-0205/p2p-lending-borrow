import { useState, useMemo, useEffect } from 'react'
import {
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Button,
  Modal,
  CircularProgress,
} from '@mui/material'
import Image from 'next/image'
import { Order, OrderState } from 'interfaces'
import { formatUnits } from 'viem'
import {
  getDecimals,
  getTokenLogoFromAddress,
  getTokenNameFromAddress,
} from 'utils/token'
import { trim } from 'utils/trim'
import { formatTimestamp } from 'utils/time'
import CloseIcon from '@mui/icons-material/Close'
import { useAccount } from 'wagmi'
import TokenAmountBox from './styled/TokenAmount'
import { useAppDispatch } from 'store/store'
import { cancelOrder, liquidateOrder, repayOrder } from 'store/slices/action'
import { useProtocolContract } from 'hooks/useContract'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getProtocolAddress } from 'utils/addressHelpers'
import { usePendingTxs } from 'hooks/usePendingTxs'
import { isPendingTxn } from 'store/slices/pendingTxs'

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  backgroundColor: '#1f304a',
  borderRadius: '15px',
  color: '#ececec',
  padding: '20px 20px',
}

function UserOrderTable({ orders }: { orders: Array<Order> }) {
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  const { address: account } = useAccount()
  const protocolContract = useProtocolContract()
  const dispatch = useAppDispatch()
  const pendingTxs = usePendingTxs()

  const [approvalState, approve] = useApproveCallback(
    order?.loanToken,
    order?.loanAmount,
    getProtocolAddress()
  )

  const [submitTxt, handleSubmit] = useMemo(() => {
    if (order) {
      if (
        order.status === OrderState.CLOSED ||
        order.status === OrderState.CANCELED
      ) {
        return ['Close', () => setOpen(false)]
      } else if (order.status === OrderState.WORKING) {
        if (order.lender === account) {
          if (Date.now() > Number(order.timestamps[1]) * 1000)
            return [
              'Liquidate',
              () =>
                dispatch(
                  liquidateOrder({
                    account,
                    protocolContract,
                    orderId: order.id,
                  })
                ),
            ]
          else return ['Close', () => setOpen(false)]
        } else {
          if (Date.now() > Number(order.timestamps[0]) * 1000) {
            if (approvalState === ApprovalState.APPROVED)
              return [
                'Repay',
                () =>
                  dispatch(
                    repayOrder({ account, protocolContract, orderId: order.id })
                  ),
              ]
            else {
              return ['Approve & Repay', approve]
            }
          } else return ['Close', () => setOpen(false)]
        }
      } else if (order.status === OrderState.OPEN) {
        return [
          'Cancel Order',
          () =>
            dispatch(
              cancelOrder({ account, protocolContract, orderId: order.id })
            ),
        ]
      }
    } else {
      return [
        'Close',
        () => {
          return 0
        },
      ]
    }
  }, [order, account, approvalState, approve, dispatch, protocolContract])

  const loading = useMemo(() => {
    return (
      approvalState === ApprovalState.PENDING ||
      isPendingTxn(pendingTxs, `order-${Number(order?.id)}`)
    )
  }, [approvalState, order, pendingTxs])

  useEffect(() => {
    if (order) {
      setOrder(orders.find((e) => e.id === order.id))
    }
  }, [orders])

  return (
    <TableContainer
      sx={{
        px: 2,
        height: '64vh',
        overflowY: 'auto',
      }}
    >
      <Table
        sx={{
          borderSpacing: '0px 5px',
          borderCollapse: 'separate',
        }}
      >
        <TableHead>
          <TableRow
            sx={{
              '& .MuiTableCell-root': {
                color: '#9597a1',
                backgroundColor: '#1f304a',
                textAlign: 'center',
                fontFamily: 'square',
                fontSize: '15px',
                borderBottom: 'none',
                paddingTop: '10px',
                paddingBottom: '10px',
              },
            }}
          >
            <TableCell>Loan Amount</TableCell>
            <TableCell>Collateral Amount</TableCell>
            <TableCell>Lender Fee</TableCell>
            <TableCell>Duration</TableCell>
            <TableCell>Reward</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order: Order, index) => {
            let feeAmount = formatUnits(
              order.lenderFeeAmount,
              getDecimals(order.loanToken)
            )
            let loanAmount = formatUnits(
              order.loanAmount,
              getDecimals(order.loanToken)
            )
            let collateralAmount = formatUnits(
              order.collateralAmount,
              getDecimals(order.collateralToken)
            )
            let feePercent = (Number(feeAmount) / Number(loanAmount)) * 100
            let duration =
              order.status === OrderState.OPEN
                ? 'Open'
                : order.status === OrderState.WORKING
                ? 'Working'
                : order.status === OrderState.CLOSED
                ? 'Closed'
                : 'Canceled'
            return (
              <TableRow
                key={index}
                sx={{
                  height: '80px',
                  cursor: 'pointer',
                  '&:hover': {
                    transitionDuration: '500ms',
                    transform: 'scale(1.02)',
                    '& .MuiTableCell-root': {
                      bgcolor: 'rgb(24,37,57)',
                    },
                  },
                  '& .MuiTableCell-root': {
                    borderBottom: '1px solid #383944',
                    borderTop: '1px solid #383944',
                    textAlign: 'center',
                    color: '#ececec !important',
                    fontFamily: 'square !important',
                    fontSize: '18px',
                    bgcolor: '#1c2c44',
                  },
                  '.MuiTableCell-root:first-of-type': {
                    borderTopLeftRadius: '10px',
                    borderBottomLeftRadius: '10px',
                    borderLeft: '1px solid #383944',
                  },
                  '.MuiTableCell-root:last-of-type': {
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px',
                    borderRight: '1px solid #383944',
                  },
                }}
                onClick={() => {
                  setOrder(order)
                  setOpen(true)
                }}
              >
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        zIndex: 100,
                        top: '-20px',
                        left: '-10px',
                        '& .MuiBox-root': {
                          border: '1px solid grey',
                          borderRadius: '5px',
                          p: 0.2,
                          mb: 0.2,
                        },
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                          {order.lender === account
                            ? 'You Supplied'
                            : 'You Borrowed'}
                        </Typography>
                      </Box>
                    </Box>
                    <Image
                      src={getTokenLogoFromAddress(order.loanToken)}
                      alt="img"
                      width={30}
                      height={30}
                    />
                    <Typography width={100}>
                      {loanAmount} {getTokenNameFromAddress(order.loanToken)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Image
                      src={getTokenLogoFromAddress(order.collateralToken)}
                      alt="img"
                      width={30}
                      height={30}
                    />
                    <Typography width={100}>
                      {collateralAmount}{' '}
                      {getTokenNameFromAddress(order.collateralToken)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ color: 'rgb(0, 247, 167)' }}>
                    {trim(feePercent)} %
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography>{duration}</Typography>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Typography sx={{ color: 'rgb(0, 247, 167)' }}>
                      {0}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {order && (
        <Modal open={open} onClose={() => setOpen(false)}>
          <Box sx={modalStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <Typography fontSize="20px">
                {order.lender === account ? 'Supply  ' : 'Borrow  '}
                Info
              </Typography>
              <CloseIcon
                onClick={() => setOpen(false)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
            <Box
              sx={{
                '& > .MuiBox-root': {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  my: 2,
                  '& > p:first-of-type': {
                    color: '#aaa',
                    fontSize: '14px',
                  },
                  '& .MuiBox-root': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                },
              }}
            >
              <Box>
                <Typography>Loan Amount</Typography>
                <Box>
                  <Image
                    src={getTokenLogoFromAddress(order.loanToken)}
                    width={20}
                    height={20}
                    alt="token_logo"
                  />
                  <Typography ml={1}>
                    {formatUnits(
                      order.loanAmount,
                      getDecimals(order.loanToken)
                    )}
                  </Typography>
                  <Typography ml={0.5}>
                    {getTokenNameFromAddress(order.loanToken)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography>Collateral Amount</Typography>
                <Box>
                  <Image
                    src={getTokenLogoFromAddress(order.collateralToken)}
                    width={20}
                    height={20}
                    alt="token_logo"
                  />
                  <Typography ml={1}>
                    {formatUnits(
                      order.collateralAmount,
                      getDecimals(order.collateralToken)
                    )}
                  </Typography>
                  <Typography ml={0.5}>
                    {getTokenNameFromAddress(order.collateralToken)}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography>Lender Fee</Typography>
                <Typography>
                  {trim(
                    (Number(
                      formatUnits(
                        order.lenderFeeAmount,
                        getDecimals(order.loanToken)
                      )
                    ) /
                      Number(
                        formatUnits(
                          order.loanAmount,
                          getDecimals(order.loanToken)
                        )
                      )) *
                      100
                  )}{' '}
                  % ({' '}
                  {trim(
                    formatUnits(
                      order.lenderFeeAmount,
                      getDecimals(order.loanToken)
                    )
                  )}{' '}
                  {getTokenNameFromAddress(order.loanToken)} )
                </Typography>
              </Box>
              <Box>
                <Typography>You will get</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TokenAmountBox
                    logo={getTokenLogoFromAddress(order.loanToken)}
                    amount={
                      order.lender === account
                        ? formatUnits(
                            order.loanAmount + order.lenderFeeAmount,
                            getDecimals(order.loanToken)
                          )
                        : formatUnits(
                            order.loanAmount - order.lenderFeeAmount,
                            getDecimals(order.loanToken)
                          )
                    }
                    symbol={getTokenNameFromAddress(order.loanToken)}
                  />

                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: 'grey',
                      maxWidth: '150px',
                      textAlign: 'right',
                    }}
                  >
                    {order.lender === account
                      ? 'Loan  + Lender Fee'
                      : 'Loan  - ( Lender Fee + Protocol Fee)'}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  px: 4,
                  flexDirection: 'column',
                  '& .MuiTypography-root': {
                    color: '#aaa',
                    fontSize: '14px',
                  },
                }}
              >
                <Typography mb={1}>
                  {order.lender === account ? 'Borrowers ' : 'You '}
                  have from
                  <span
                    style={{
                      fontSize: '16px',
                      color: '#ccc',
                      padding: '0 5px',
                    }}
                  >
                    {formatTimestamp(Number(order.timestamps[0]) * 1000)}
                  </span>
                  to repay your loan, with the deadline being
                  <span
                    style={{
                      fontSize: '16px',
                      color: '#ccc',
                      padding: '0 5px',
                    }}
                  >
                    {formatTimestamp(Number(order.timestamps[1]) * 1000)}
                  </span>
                </Typography>
                <Typography>
                  If the repayment is not completed, all collateral amount go to
                  the lender.
                </Typography>
              </Box>
            </Box>
            <Box mx={5}>
              <Button onClick={handleSubmit}>
                {submitTxt}
                {loading && (
                  <CircularProgress sx={{ color: 'white', ml: 2 }} size={20} />
                )}
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </TableContainer>
  )
}
export default UserOrderTable
