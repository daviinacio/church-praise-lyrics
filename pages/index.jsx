import { useEffect } from 'react'
import SEO from '../components/SEO'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { Container, makeStyles } from '@material-ui/core'
import { useAPI } from '../services/api'

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
  const api = useAPI()

  useEffect(() => {
    router.push('/praises')
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
