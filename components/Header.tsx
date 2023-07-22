import { AppBar, Toolbar, Box, Typography } from '@mui/material'
import * as React from 'react'
import Button from '@mui/material/Button'
import { useRouter } from 'next/router'
import { ConnectKitButton } from 'connectkit'
import Image from 'next/image'
import LogoImage from '../assets/images/logo.png'

const Header = () => {
  const router = useRouter()
  const [anchorState, setAnchorState] = React.useState<any | null>({
    btn1: null,
    btn2: null,
  })

  const handleClick = (e) => {
    setAnchorState({ [e.target.name]: e.currentTarget })
  }

  const handleClose = (e) => {
    setAnchorState({ [e.target.name]: null })
  }
  return (
    <AppBar
      position="relative"
      elevation={0}
      sx={{
        backgroundImage: 'linear-gradient(90deg,#243b55,#182539)! important',
      }}
    >
      <Toolbar disableGutters variant="dense" sx={{ p: 3 }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ececec',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <Box>
              <Image src={LogoImage} alt="logo" width={40} height={50} />
            </Box>
          </Box>
          <Box>
            <Typography
              sx={{ fontSize: '40px', fontFamily: 'Square !important' }}
            >
              {router.pathname == '/'
                ? 'Orders Book'
                : router.pathname == '/account'
                ? 'My Account'
                : router.pathname == '/dashboard'
                ? 'Dashboard'
                : ''}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              '& .MuiButton-root': {
                minWidth: '120px',
              },
            }}
          >
            <Box>
              <Button
                id="basic-button-2"
                aria-controls={
                  Boolean(anchorState.btn2) ? 'basic-menu-2' : undefined
                }
                aria-haspopup="true"
                aria-expanded={Boolean(anchorState.btn2) ? 'true' : undefined}
                onClick={handleClick}
                name="btn2"
              >
                Avalanche
              </Button>
            </Box>
            <ConnectKitButton />
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
