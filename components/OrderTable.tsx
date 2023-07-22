import { useState, useMemo } from 'react'
import {
  TableCell,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Modal,
  Button,
  CircularProgress,
} from '@mui/material'
import Image from 'next/image'
import { Order, OrderRole, OrderState } from 'interfaces'
import {
  getDecimals,
  getTokenLogoFromAddress,
  getTokenNameFromAddress,
} from 'utils/token'
import { formatUnits } from 'viem'
import { trim } from 'utils/trim'
import CloseIcon from '@mui/icons-material/Close'
import { formatTimestamp } from 'utils/time'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getProtocolAddress } from 'utils/addressHelpers'
import { useAccount } from 'wagmi'
import TokenAmountBox from './styled/TokenAmount'
import { useAppDispatch } from 'store/store'
import { getOrder } from 'store/slices/action'
import { useProtocolContract } from 'hooks/useContract'
import { isPendingTxn } from 'store/slices/pendingTxs'
import { usePendingTxs } from 'hooks/usePendingTxs'

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

function OrderTable({ orders }: { orders: Array<Order> }) {
  const [open, setOpen] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)

  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const contract = useProtocolContract()
  const pendingTxs = usePendingTxs()

  const [approvalState, approve] = useApproveCallback(
    order?.role === OrderRole.SUPPLY
      ? order?.collateralToken
      : order?.loanToken,
    order?.role === OrderRole.SUPPLY
      ? order?.collateralAmount
      : order?.loanAmount,
    getProtocolAddress()
  )

  const takeOrder = () => {
    if (order?.id !== undefined) {
      dispatch(
        getOrder({ account, protocolContract: contract, orderId: order.id })
      )
    }
  }

  const loading = useMemo(() => {
    return (
      isPendingTxn(pendingTxs, `getOrder-${Number(order?.id)}`) ||
      approvalState === ApprovalState.PENDING
    )
  }, [approvalState, pendingTxs])

  const submitTxt = useMemo(() => {
    if (approvalState === ApprovalState.PENDING) return 'Approving'
    else if (approvalState === ApprovalState.APPROVED)
      return order.role === OrderRole.SUPPLY ? 'Take Loan' : 'Supply'
    else
      return `Approve & ${
        order?.role === OrderRole.SUPPLY ? 'Take Loan' : 'Supply'
      }`
  }, [account, order, approvalState])

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
                  setOpen(true)
                  setOrder(order)
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
                        border: '1px solid grey',
                        borderRadius: '5px',
                        p: 0.2,
                      }}
                    >
                      <Typography sx={{ fontSize: '10px', color: 'grey' }}>
                        {order.role === OrderRole.SUPPLY
                          ? 'Supply Order'
                          : 'Borrow Order'}
                      </Typography>
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
                {order.role === OrderRole.SUPPLY
                  ? 'Supply Order '
                  : 'Borrow Order '}
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
                <TokenAmountBox
                  logo={getTokenLogoFromAddress(order.loanToken)}
                  amount={formatUnits(
                    order.loanAmount,
                    getDecimals(order.loanToken)
                  )}
                  symbol={getTokenNameFromAddress(order.loanToken)}
                />
              </Box>
              <Box>
                <Typography>Collateral Amount</Typography>
                <TokenAmountBox
                  logo={getTokenLogoFromAddress(order.collateralToken)}
                  amount={formatUnits(
                    order.collateralAmount,
                    getDecimals(order.collateralToken)
                  )}
                  symbol={getTokenNameFromAddress(order.collateralToken)}
                />
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
                <Typography>
                  {order.role === OrderRole.SUPPLY ? 'Borrower ' : 'Lender '}
                  will get
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {order.role === OrderRole.SUPPLY ? (
                    <TokenAmountBox
                      logo={getTokenLogoFromAddress(order.loanToken)}
                      amount={formatUnits(
                        order.loanAmount - order.lenderFeeAmount,
                        getDecimals(order.loanToken)
                      )}
                      symbol={getTokenNameFromAddress(order.loanToken)}
                    />
                  ) : (
                    <Box>
                      <TokenAmountBox
                        logo={getTokenLogoFromAddress(order.loanToken)}
                        amount={formatUnits(
                          order.loanAmount,
                          getDecimals(order.loanToken)
                        )}
                        symbol={getTokenNameFromAddress(order.loanToken)}
                      />
                      <Typography px={1}> + </Typography>

                      <TokenAmountBox
                        logo={getTokenLogoFromAddress(order.loanToken)}
                        amount={formatUnits(
                          order.lenderFeeAmount,
                          getDecimals(order.loanToken)
                        )}
                        symbol={getTokenNameFromAddress(order.loanToken)}
                      />
                    </Box>
                  )}

                  <Typography
                    sx={{
                      fontSize: '12px',
                      color: 'grey',
                      maxWidth: '150px',
                      textAlign: 'right',
                    }}
                  >
                    {order.role === OrderRole.SUPPLY
                      ? 'Loan Amount - (Lender Fee + Protocol Fee)'
                      : 'Your Deposit + Lender Fee'}
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
                  {order.role === OrderRole.SUPPLY ? 'You ' : 'Borrowers '}
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

            {account !== order.lender &&
            account !== order.borrower &&
            account &&
            order.status === OrderState.OPEN ? (
              <Box mx={5}>
                <Button
                  onClick={() => {
                    if (loading) return
                    if (approvalState === ApprovalState.APPROVED) {
                      takeOrder()
                    } else if (approvalState === ApprovalState.NOT_APPROVED)
                      approve()
                  }}
                >
                  {submitTxt}
                  {loading && (
                    <CircularProgress
                      sx={{ color: 'white', ml: 2 }}
                      size={20}
                    />
                  )}
                </Button>
              </Box>
            ) : (
              <Box mx={5}>
                <Button onClick={() => setOpen(false)}>Close</Button>
              </Box>
            )}
          </Box>
        </Modal>
      )}
    </TableContainer>
  )
}

export default OrderTable
