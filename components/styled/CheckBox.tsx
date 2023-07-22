import { makeStyles } from '@mui/styles'
import { Checkbox } from '@mui/material'
import * as React from 'react'
const useStyles = makeStyles({
  root: {},
})

const CustomCheckBox = () => {
  // const classes = useStyles()
  return (
    <>
      <input type="checkbox" className="form-check-input" />
    </>
  )
}
export default CustomCheckBox
