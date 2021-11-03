import '../styles/globals.css'

import React, { useEffect, useState } from 'react'
import { CssBaseline, Snackbar, ThemeProvider } from '@material-ui/core'

import { 
  BottomNavigation, BottomNavigationAction, Typography, Box
} from '@material-ui/core'

import {
  Person as PersonIcon,
  ViewDay as ViewDayIcon,
  LibraryMusic as LibraryMusicIcon
} from '@material-ui/icons'

import { useRouter } from 'next/router'
import theme from '../src/theme'
import { withSnackbar } from '../components/SnackbarHOC'

const routesWithNavigation = [
  "schedule", "praises", "member"
]

function MyApp({ Component, pageProps }) {
  const router = useRouter()

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />

      { routesWithNavigation.filter(r =>
        r.indexOf(router.pathname.split('/')[1] || '$') >= 0
      ).length > 0 &&
        <BottomNavigation
          style={{ width: '100%', position: 'fixed', bottom: 0 }}
          value={router.pathname.split('/')[1]}
          onChange={(event, newValue) => {
            router.push(`/${newValue}`);
          }}
          showLabels
        >
          {/* <BottomNavigationAction label="Escala" value="schedule" icon={<ViewDayIcon />} /> */}
          <BottomNavigationAction label="Louvores" value="praises" icon={<LibraryMusicIcon />} />
          <BottomNavigationAction label="Membro" value="member" icon={<PersonIcon />} />
        </BottomNavigation>
      }
    </ThemeProvider>
  )
}

export default withSnackbar(MyApp)
