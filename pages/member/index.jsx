import SEO from '../../components/SEO'

import { 
  AppBar, Container, Typography, Toolbar, Button, makeStyles
} from '@material-ui/core'

import { useAuth } from '../../src/auth'
import LoginPage from '../login'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    paddingBottom: 56,
    height: '-webkit-fill-available',
    minHeight: '-webkit-fill-available'
  },
  root2: {
    paddingBottom: 56,
    height: '-webkit-fill-available',
    minHeight: '-webkit-fill-available'
  }
}))

export default function MemberPage() {
  const auth = useAuth()
  const user = auth.getUser()
  const router = useRouter()
  const classes = useStyles()

  function handleLogout(){
    auth.clearCredentials()
    router.push('member')
  }

  if(auth.isAuthenticated())
    return (
      <>
        <SEO title="Membro" />
        <AppBar>
          <Toolbar>
            <Typography variant="h6">
              Membro
            </Typography>
          </Toolbar>
        </AppBar>

        <div className={classes.root}>
          <h1>Bem-vindo {user.name}</h1>
          <Button
            variant='contained'
            color='primary'
            onClick={() => handleLogout()}>
            Sair da conta
          </Button>
        </div>
      </>
    )
  else return <div className={classes.root2}><LoginPage/></div>
}
