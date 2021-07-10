import '../styles/globals.css'

import React, { useEffect, useState } from 'react'
import { ThemeProvider } from '@material-ui/core'

import { 
  BottomNavigation, BottomNavigationAction, Typography, Box
} from '@material-ui/core'

import {
  Person as PersonIcon,
  ViewDay as ViewDayIcon,
  LibraryMusic as LibraryMusicIcon
} from '@material-ui/icons'

import { useRouter } from 'next/router'
import theme from '../styles/theme'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  //const sheets = new ServerStyleSheets()

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />

      <BottomNavigation
        style={{ width: '100%', position: 'fixed', bottom: 0 }}
        value={router.pathname.split('/')[1]}
        onChange={(event, newValue) => {
          router.push(`/${newValue}`);
        }}
        showLabels
      >
        <BottomNavigationAction label="Escala" value="schedule" icon={<ViewDayIcon />} />
        <BottomNavigationAction label="Louvores" value="praises" icon={<LibraryMusicIcon />} />
        <BottomNavigationAction label="Membro" value="member" icon={<PersonIcon />} />
      </BottomNavigation>
    </ThemeProvider>
  )
}

export default MyApp
