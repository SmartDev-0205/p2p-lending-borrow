import { Typography, Box, TextField } from '@mui/material'
import { styled } from '@mui/styles'
import { DatePickerType, OrderType } from 'interfaces'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  IActionSlice,
  setSupStartTimestamp,
  setSupEndTimestamp,
  setBorrowStartTimestamp,
  setBorrowEndTimestamp,
} from 'store/slices/action'
import { IReduxState } from 'store/store'
import { getDays } from 'utils/time'

const StyledTextField = styled(TextField)({
  width: '70px',
  backgroundColor: '#182539',
  border: '1px solid #383944',
  borderRadius: '8px',
  '& .MuiOutlinedInput-root': {
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
  '& .MuiInputBase-input': {
    color: '#ececec',
    fontSize: '15px',
    height: '2px',
  },
})

const DatePicker = ({
  pickerType,
  orderType,
}: {
  pickerType: DatePickerType
  orderType: OrderType
}) => {
  //
  const dispatch = useDispatch()
  const actionState = useSelector<IReduxState, IActionSlice>(
    (state) => state.action
  )

  const ts =
    pickerType === DatePickerType.START && orderType === OrderType.SUPPLY
      ? actionState.supply.startTimestamp
      : pickerType === DatePickerType.END && orderType === OrderType.SUPPLY
      ? actionState.supply.endTimestamp
      : pickerType === DatePickerType.START && orderType === OrderType.BORROW
      ? actionState.borrow.startTimestamp
      : actionState.borrow.endTimestamp

  const d = new Date(ts)

  const [date, setDate] = useState<{
    year: number
    month: number
    day: number
    hour: number
    minute: number
  }>({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    day: d.getDate(),
    hour: d.getHours(),
    minute: d.getMinutes(),
  })

  useEffect(() => {
    const timestamp = new Date(
      date.year,
      date.month - 1,
      date.day,
      date.hour,
      date.minute
    ).getTime()
    if (pickerType === DatePickerType.START && orderType === OrderType.SUPPLY) {
      dispatch(setSupStartTimestamp({ timestamp }))
    } else if (
      pickerType === DatePickerType.END &&
      orderType === OrderType.SUPPLY
    ) {
      dispatch(setSupEndTimestamp({ timestamp }))
    } else if (
      pickerType === DatePickerType.START &&
      orderType === OrderType.BORROW
    ) {
      dispatch(setBorrowStartTimestamp({ timestamp }))
    } else if (
      pickerType === DatePickerType.END &&
      orderType === OrderType.BORROW
    ) {
      dispatch(setBorrowEndTimestamp({ timestamp }))
    }
  }, [date, pickerType, orderType, dispatch])

  return (
    <Box
      sx={{
        border: '1px solid #454f5b',
        px: '10px',
        pb: 1,
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 1,
        flexWrap: 'wrap',
        '& .MuiTypography-root': {
          fontSize: '13px',
          color: '#9597a1',
          mt: ' 0px !important',
          ml: '5px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box>
          <Typography>year</Typography>
          <StyledTextField
            value={d.getFullYear()}
            type="number"
            onChange={(e) => {
              let year = Number(e.target.value)
              if (year >= 2023 && year <= 2050) setDate({ ...date, year })
            }}
          />
        </Box>
        <Box>
          <Typography>Month</Typography>

          <StyledTextField
            value={d.getMonth() + 1}
            type="number"
            onChange={(e) => {
              let month = Number(e.target.value)
              if (month >= 1 && month <= 12) setDate({ ...date, month })
            }}
          />
        </Box>
        <Box>
          <Typography>Day</Typography>
          <StyledTextField
            value={d.getDate()}
            type="number"
            onChange={(e) => {
              let day = Number(e.target.value)
              if (day >= 1 && day <= getDays(date.month, date.year))
                setDate({ ...date, day })
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 0.3,
        }}
      >
        <Box>
          <Typography>hour</Typography>
          <StyledTextField
            value={d.getHours()}
            type="number"
            onChange={(e) => {
              let hour = Number(e.target.value)
              if (hour >= 0 && hour <= 23) setDate({ ...date, hour })
            }}
          />
        </Box>
        <Box>
          <Typography sx={{ pt: '27px', color: 'white !important' }}>
            :
          </Typography>
        </Box>
        <Box>
          <Typography>minutes</Typography>
          <StyledTextField
            value={d.getMinutes()}
            type="number"
            onChange={(e) => {
              let minute = Number(e.target.value)
              if (minute >= 0 && minute <= 59) setDate({ ...date, minute })
            }}
          />
        </Box>
      </Box>
    </Box>
  )
}
export default DatePicker
