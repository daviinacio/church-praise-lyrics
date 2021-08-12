import { useEffect } from 'react';
import SEO from '../components/SEO';
import useAPI from '../services/useAPI'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Container, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  }
}))

export default function MainPage() {
  const classes = useStyles()
  const router = useRouter()
  const api = useAPI({
    suppressRedirect: true
  })

  useEffect(() => {
    api.post('auth/me')
      .then(() => router.push('/schedule'))
      .catch(() => router.push('/login'))
  }, [])

  return <>
    <SEO />
    <Container className={classes.root}>
      <Image
        src={"/logo.png"}
        layout="fixed"
        width={250}
        height={250}/>
    </Container>
  </>
}
