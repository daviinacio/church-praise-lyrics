import { AppBar, Button, Link, Grid, makeStyles, Paper, TextField, Toolbar, Typography } from "@material-ui/core";
import { useState } from "react";
import SEO from "../components/SEO";
import Image from 'next/image'
import { SettingsApplications } from "@material-ui/icons";

import Validator from 'rest-payload-validator'

import NextLink from 'next/link'
import signupValidation from "../src/validation/signupValidation";
import api from "../services/api";
import { useRouter } from "next/router";
import { normalizeTextIdentifier } from "../src/utils";

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
  },
  containerCenter: {
    display: "flex",
    justifyContent: "center"
  }
}))

export default function RegisterPage() {
  const classes = useStyles()
  const router = useRouter()

  const [validation, setValidation] = useState({})

  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(e){
    e.preventDefault()
    const customValidation = {}
    var serverValidation = {}

    const clientValidation = signupValidation.values({
      name, username, email, password
    }).build()

    if(clientValidation.alright()){
      if(password !== confirmPassword){
        customValidation.confirmPassword = "As senhas estão diferentes"
      }
      else {
        await api.post(`auth/signup`, {
          name, username, email, password
        })
        .then(({data}) => {
          snackbar(data.message)
          router.push('/login')
        })
        .catch(({response}) => {
          serverValidation = response.data.validation
        })
      }
    }
    
    setValidation({ ...clientValidation.errors, ...customValidation, ...serverValidation})
  }

  return (
    <>
      <SEO title="Criar login" />

      <form className={classes.root} onSubmit={(e) => handleSubmit(e)} noValidate>
        <Paper elevation={0} className={classes.paper}>
          <Grid sm={12} className={classes.containerCenter}>
            <Typography variant="h4">
              Criar login
            </Typography>
          </Grid>

          <TextField
            required
            id="form-name"
            label="Nome"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setUsername(normalizeTextIdentifier(e.target.value))
              setValidation({
                ...validation, username: undefined
              })
            }}
            error={typeof validation.name === 'string'}
            helperText={validation.name}/>

          <TextField
            required
            disabled={typeof validation.username === 'undefined'}
            id="form-username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(normalizeTextIdentifier(e.target.value))}
            error={typeof validation.username === 'string'}
            helperText={validation.username}/>

          <TextField
            required
            id="form-email"
            type="email"
            label="Email"
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

          <TextField
            required
            id="form-confirm-password"
            type="password"
            label="Confirmar senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={typeof validation.confirmPassword === 'string'}
            helperText={validation.confirmPassword}/>

          <Grid container>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                type="submit">
                  Registrar
              </Button>
            </Grid>
          </Grid>

          <Grid className={classes.containerCenter} container>
            <NextLink href={"/login"}>
              <Link href={"/login"}>Já tenho um login</Link>
            </NextLink>
          </Grid>
        </Paper>
      </form>
    </>
  )
}