import { styled } from '@mui/material/styles'
import { TextField } from '@mui/material'

export const StyledTextField = styled(TextField)({
  width: '100px',
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
  '& input': {
    color: '#ececec',
    fontSize: '20px',
    height: '7px',
    marginLeft: '2px',
  },
})
