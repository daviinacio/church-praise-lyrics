import SEO from '../components/SEO'

import { 
  AppBar, Container, Typography, Checkbox, Button, Paper, TextField, makeStyles, Grid, FormControlLabel
} from '@material-ui/core'

import Image from 'next/image'

import { useState } from 'react'
import { useAuth } from '../src/auth'
import { useRouter } from 'next/router'
import { useAPI } from '../services/api'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '-webkit-fill-available',
    height: "100%",
    '& > *': {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    },

    '& > * > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: '100%'
    },

    '& .MuiGrid-item > *': {
      width: '100%'
    }
  },
  paper: {
    maxWidth: 400,
    width: "100%",
    margin: "auto",
    display: "block"
  },
  logoContainer: {
    textAlign: "center",
    margin: 0
  },
  logo: {
    objectFit: "cover",
  }
}))

export default function LoginPage() {
  const classes = useStyles()
  const api = useAPI()
  const auth = useAuth()
  const router = useRouter()

  const [validation, setValidation] = useState({})
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [keep, setKeep] = useState(false)  

  async function handleSubmit(e){
    e.preventDefault()
    const formValidation = {}
    
    // Client validations
    if(email.trim() === '')
      formValidation.email = "Preencha seu login antes de continuar"

    if(password.trim() === '')
      formValidation.password = "Preencha a senha antes de continuar"

    if(Object.keys(formValidation).length > 0){
      setValidation(formValidation)
      return;
    }

    await api.post(`auth/login?keep=${keep}`, {
      email, password
    })
    .then(({data}) => {
      auth.saveCredentials(
        data.result.user,
        data.result.token
      )

      router.push('/')
    })
    .catch(({response}) => {
      const validation = Object.fromEntries(
        response.data.validation.map(e => [
          e.field, e.message
        ])
      )
      
      setValidation(validation)
    })
  }

  return (
    <>
      <SEO title="Login" />

      <form className={classes.root} onSubmit={(e) => handleSubmit(e)} noValidate>
        <Paper elevation={5} className={classes.paper}>
          <Container className={classes.logoContainer}>
            <Image
              src={"/logo.png"}
              layout="fixed"
              width={250}
              height={150}
              className={classes.logo}/>
          </Container>
          <TextField
            required
            id="form-email"
            type="email"
            label="Email ou username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={typeof validation.email === 'string'}
            helperText={validation.email}/>

          <TextField
            required
            id="form-password"
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={typeof validation.password === 'string'}
            helperText={validation.password}/>

          <FormControlLabel
            label="Manter-me logado"
            control={
              <Checkbox
                checked={keep}
                onChange={(e) => setKeep(e.target.checked)}
                color="primary"
              />
            }
          />

          <Grid container>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit">
                  Logar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </>
  )
}
