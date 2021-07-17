import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SEO from '../../../components/SEO'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

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
  Select
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab';


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
    }
  },
  select: {
    width: '100%',
  }
}))

export default function EditPraisePage() {
  const classes = useStyles()
  const router = useRouter()

  const { praiseId } = router.query

  const [isLoading, setIsLoading] = useState(true)
  const [praise, setPraise] = useState({})
  
  const pageTitle = (praiseId ? "Editar" : "Nova sugestão de") + " louvor"

  useEffect(async () => {
    if(praiseId){
      const { data } = await axios.get(`/api/v1/praises/${praiseId}`)

      setPraise(data)
      setIsLoading(false)
    }

    if(router.pathname === '/praises/new')
      setIsLoading(false)

  }, [router])

  async function handleFormSubmit(event){
    event.preventDefault();

    if(praiseId)
      await axios.put(`/api/v1/praises/${praiseId}`, praise)
    else
      await axios.post(`/api/v1/praises/`, praise)

    router.push('/praises')
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
        <form onSubmit={handleFormSubmit} className={classes.pageForm}>
          <EditPraiseFields value={praise} onChange={(p) => setPraise(p)} />
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

  const [praise, setPraise] = useState(initialValue || {})

  useEffect(() => {
    setPraise(initialValue || {})
  }, [initialValue])

  async function handleOnSubmit(event){
    event.preventDefault();

    if(praise.id){
      await axios.put(`/api/v1/praises/${praise.id}`, praise)

      if(typeof onSave === 'function')
        onSave(praise)
    }
    else {
      const response = await axios.post(`/api/v1/praises`, praise)

      if(typeof onSave === 'function')
        onSave(response.data)
    }
  }

  return (
    <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">
        { (praise.id ? 'Editar' : 'Nova sugestão de') + ' louvor' }
      </DialogTitle>

      <form onSubmit={handleOnSubmit} className={classes.dialogForm}>
        <DialogContent>
          <EditPraiseFields value={praise} onChange={(p) => setPraise(p)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" color="primary">Salvar</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function EditPraiseFields({ value, onChange }) {
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
        />
      
      <TextField
        required
        id="form-artist"
        label="Cantor / Grupo / Banda"
        value={value.artist || ''}
        onChange={(e) => setValue({...value, artist: e.target.value})}
        />

      <div style={{display: 'flex', marginBottom: 16}}>
        <div style={{flex: 1}}>
          <InputLabel id="form-praises-tone-label">Tom original</InputLabel>
          <Select
            labelId="form-praises-tone-label"
            id="form-praises-tone"
            value={value.tone || ''}
            className={classes.select}
            displayEmpty
            onChange={(e) => setValue({...value, tone: e.target.value})}
          >
            <MenuItem value="">
              Não definido
            </MenuItem>
            {toneOptions.map((tone => (
              <MenuItem key={tone} value={tone}>{tone}</MenuItem>
            )))}
          </Select>
        </div>
        <div style={{flex: 1, marginLeft: 10}}>
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
        </div>
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