import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SEO from '../../../components/SEO'
import { makeStyles } from '@material-ui/core/styles'

import { 
  AppBar,
  Container,
  Typography,
  Toolbar,
  Backdrop,
  CircularProgress,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  DialogContentText
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import { useAPI } from '../../../services/api'


const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: 56,
    paddingBottom: 56,
    minHeight: '-webkit-fill-available'
  },
  content: {
    
  },
  dialogContent: { },
  pageForm: {
    // paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    '& > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: '100%',
    }
  },
  pageFormButtons: {
    width: '100%',
    marginTop: 10
  },
  dialogForm: {
    '& > .MuiDialogContent-root > *': {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
      width: '100%',
    },
    '& div': {
      // position: 'relative'
    }
  },
  select: {
    width: '100%',
  }
}))

const praiseEmpty = {
  id: '',
  status: 'suggestion',
  name: '',
  artist: '',
  tone: '?',
  transpose: 0
}

export default function EditPraisePage() {
  const [validation, setValidation] = useState({})
  const classes = useStyles()
  const router = useRouter()
  const api = useAPI()

  const { praiseId } = router.query

  const [isLoading, setIsLoading] = useState(true)
  const [praise, setPraise] = useState(praiseEmpty)
  
  const pageTitle = (praiseId ? "Editar" : "Nova sugestão de") + " louvor"

  useEffect(async () => {
    if(praiseId){
      const { data } = await api.get(`praises/${praiseId}`)

      setPraise(data)
      setIsLoading(false)
    }

    if(router.pathname === '/praises/new')
      setIsLoading(false)

  }, [router])

  async function handleFormSubmit(event){
    event.preventDefault();

    if(praiseId){
      await api.put(`praises/${praiseId}`, praise).then(() => {
        router.push('/praises')
      })
      .catch(({response}) => {
        setValidation(response.data.validation)
      })
    }
    else {
      await api.post(`praises/`, praise).then(() => {
        router.push('/praises')
      })
      .catch(({response}) => {
        setValidation(response.data.validation)
      })
    }
  }

  return (
    <>
      <SEO title={pageTitle} />
      <AppBar>
        <Toolbar>
          <Typography variant="h6">{pageTitle}</Typography>
        </Toolbar>
      </AppBar>

      <Container className={classes.root}>
        <form onSubmit={handleFormSubmit} className={classes.pageForm} noValidate>
          <EditPraiseFields value={praise} validation={validation} onChange={(p) => setPraise(p)} />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.pageFormButtons}
          >
            Salvar
          </Button>
        </form>
      </Container>
      
      <Backdrop variant="loading" open={isLoading}>
        <CircularProgress color={"primary"} />
      </Backdrop>
    </>
  )
}

export function EditPraiseDialog({ onClose, onSave, open, initialValue }){
  const classes = useStyles()
  const api = useAPI()

  const [validation, setValidation] = useState({})
  const [dialogConfirmOpen, setDialogConfirmOpen] = useState(false)
  const [dialogConfirmMessage, setDialogConfirmMessage] = useState(false)

  const [praise, setPraise] = useState(initialValue || praiseEmpty)

  useEffect(() => {
    setPraise(initialValue || praiseEmpty)
  }, [initialValue])
  
  function handleInflateDialogConfirm(message){
    setDialogConfirmMessage(message)
    setDialogConfirmOpen(true)
  }

  function handleCloseDialogConfirm(){
    setDialogConfirmOpen(false)
  }

  function handleSelectDialogConfirm(){
    setDialogConfirmOpen(false)
    handleOnSubmit(undefined, true)
  }

  async function handleOnSubmit(event, force = false){
    if(event) event.preventDefault();

    if(praise.id){
      await api.put(`praises/${praise.id}`, praise).then(({ data }) => {
        if(typeof onSave === 'function')
          onSave(data.result)
      })
      .catch(({response}) => {
        setValidation(response.data.validation)
      })
    }
    else {
      await api.post(`praises/?force=${force}`, praise).then(({ data }) => {
        if(typeof onSave === 'function')
          onSave(data.result)
      })
      .catch(({response}) => {
        switch(response.data.code){
          case 'ERR_VALIDATION_FAILED':
            setValidation(response.data.validation)
            break
          case 'ERR_LYRICS_NOT_FOUND':
            handleInflateDialogConfirm(response.data.message)
            break
        }
      })
    }
  }

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle>
        { (praise.id ? 'Editar' : 'Nova sugestão de') + ' louvor' }
      </DialogTitle>

      <form onSubmit={handleOnSubmit} className={classes.dialogForm} noValidate>
        <DialogContent>
          <EditPraiseFields value={praise} validation={validation} onChange={(p) => setPraise(p)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" color="primary">Salvar</Button>
        </DialogActions>
      </form>

      <Dialog
        open={dialogConfirmOpen}
        onClose={handleCloseDialogConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Letra não encontrada</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{dialogConfirmMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSelectDialogConfirm} color="primary" autoFocus>
            Salvar mesmo assim
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  )
}

function EditPraiseFields({ value, validation, onChange }) {
  const classes = useStyles()
  
  const praiseTags = [
    'ministração', 'oferta', 'adoração'
  ]

  const toneOptions = [
    'C', 'C#', 'Cm',
    'D', 'D#', 'Db', 'Dm',
    'E', 'E#', 'Eb', 'Em',
    'F', 'F#', 'Fm',
    'G', 'G#', 'Gb', 'Gm',
    'A', 'A#', 'Ab', 'Am',
    'B', 'B#', 'Bb', 'Bm',
  ]

  function setValue(newValue){
    if(typeof onChange === 'function')
      onChange(newValue)
  }

  return (
    <>
      <TextField
        required
        id="form-name"
        label="Nome do louvor"
        value={value.name || ''}
        onChange={(e) => setValue({...value, name: e.target.value})}
        disabled={typeof value.vagalume_id === 'string'}
        error={typeof validation.name === 'string'}
        helperText={validation.name}/>
      
      <TextField
        required
        id="form-artist"
        label="Cantor / Grupo / Banda"
        value={value.artist || ''}
        onChange={(e) => setValue({...value, artist: e.target.value})}
        disabled={typeof value.vagalume_id === 'string'}
        error={typeof validation.artist === 'string'}
        helperText={validation.artist}/>

      <div style={{display: 'flex', marginBottom: 16}}>
        <FormControl style={{flex: 1}}>
          <InputLabel id="form-praises-tone-label">Tom original</InputLabel>
          <Select
            labelId="form-praises-tone-label"
            id="form-praises-tone"
            value={value.tone || ''}
            className={classes.select}
            displayEmpty
            onChange={(e) => setValue({...value, tone: e.target.value})}
          >
            <MenuItem value="?">
              Não definido
            </MenuItem>
            {toneOptions.map((tone => (
              <MenuItem key={tone} value={tone}>{tone}</MenuItem>
            )))}
          </Select>
        </FormControl>
        <FormControl style={{flex: 1, marginLeft: 10}}>
          <InputLabel id="form-praises-transpose-label">Transpose (ST)</InputLabel>
          <Select
            labelId="form-praises-transpose-label"
            id="form-praises-transpose"
            value={value.transpose || 0}
            className={classes.select}
            displayEmpty
            onChange={(e) => setValue({...value, transpose: e.target.value})}
          >
            {[+5, +4, +3, +2, +1].map((transpose) => (
              <MenuItem key={transpose} value={transpose}>{'+' + transpose}</MenuItem>
            ))}

            <MenuItem value={0}>
              Desligado
            </MenuItem>

            {[-1, -2, -3, -4, -5].map((transpose) => (
              <MenuItem key={transpose} value={transpose}>{transpose}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      <Autocomplete
        multiple
        id="tags-filled"
        options={praiseTags}
        value={value.tags || []}
        freeSolo
        onChange={(event, newValue) => {
          setValue({
            ...value,
            tags: newValue
          });
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Classificação" placeholder="Digite uma classificação" />
        )}
      />
    </>
  )
}