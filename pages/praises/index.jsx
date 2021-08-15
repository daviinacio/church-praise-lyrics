import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import SwipeableViews from 'react-swipeable-views'
import SEO from '../../components/SEO'
import TabPanel, { a11yProps } from '../../components/TabPanel'
import { makeStyles } from '@material-ui/core/styles'

import {
  AppBar,
  Avatar,
  Backdrop,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Fab,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@material-ui/core'

import {
  MoreVert as MoreVertIcon,
  Add as AddIcon
} from '@material-ui/icons'

import { EditPraiseDialog } from './[praiseId]/edit'
import { useAPI } from '../../services/api'
import { useAuth } from '../../src/auth'
import { PraiseStatus } from '@prisma/client'

const editWithDialog = true

const useStyles = makeStyles((theme) => ({
  content: {
    paddingTop: 104,
    paddingBottom: 56,
    minHeight: '-webkit-fill-available'
  },
  fab: {
    position: 'fixed',
    bottom: 56 + theme.spacing(2),
    right: theme.spacing(2),
  },
  card: {
    marginTop: 8,
    marginBottom: 8
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  tone: {
    backgroundColor: theme.palette.primary.dark
  }
}))

export default function PraisesListPage() {
  const classes = useStyles()
  const router = useRouter()
  const auth = useAuth()
  const api = useAPI()

  function handleShowPraiseDetails(praiseId) {
    router.push(`/praises/${praiseId}`)
  }

  // Tabs
  const [tab, setTab] = useState(2)

  useEffect(() => {
    setTab(parseInt(sessionStorage.getItem('praises.tab')) || 0)
  }, [])

  function handleChangeTab(event, newTab) {
    setTab(newTab)
    sessionStorage.setItem('praises.tab', newTab)
  }

  // Float menu on list
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorData, setAnchorData] = useState({ id: '' })

  function handleMenuInflate(event, data) {
    setAnchorData(data)
    setAnchorEl(event.currentTarget)
  }

  async function handleMenuChangeStatus(praiseId, newStatus) {
    handleMenuClose()

    await api.put(`praises/${praiseId}`, {
      status: newStatus
    })
      .then(() => {
        setPraises(praises.map(praise => {
          if (praise.id === praiseId)
            praise.status = newStatus
          return praise
        }))
      })
      .catch(() => { })
  }

  function handleMenuEdit(data) {
    if (editWithDialog) {
      handleDialogEditorInflate(data)
      handleMenuClose()
    }
    else
      router.push(`/praises/${data.id}/edit`)
  }

  async function handleMenuRemove(praiseId) {
    handleMenuClose()

    await api.delete(`praises/${praiseId}`).then(() => {
      setPraises(praises.filter(praise => {
        return praise.id !== praiseId
      }))
    })
      .catch(() => { })
  }

  function handleMenuClose() {
    setAnchorEl(null)
    setTimeout(() => setAnchorData({ id: '' }), 250)
  }

  // Dialog Editor
  const [dialogEditorOpen, setDialogEditorOpen] = useState(false)
  const [dialogEditorData, setDialogEditorData] = useState({})

  function handleDialogEditorInflate(data) {
    setDialogEditorData(data)
    setDialogEditorOpen(true)
  }

  function handleDialogEditorSave(data) {
    handleDialogEditorClose()

    if (praises.some(e => e.id === data.id)) {
      setPraises(praises.map(praise => {
        if (praise.id === data.id)
          praise = data
        return praise
      }))
    }
    else {
      setPraises([...praises, data])
    }

    setDialogEditorData({})
  }

  function handleDialogEditorClose() {
    setDialogEditorOpen(false)
  }

  // Content data
  const [praises, setPraises] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(async () => {
    await api.get('praises').then(({ data }) => {
      const { result } = data
      setPraises(result)
      setIsLoading(false)
    })
      .catch(() => { })
  }, [])

  return (
    <>
      <SEO title="Louvores" />
      <AppBar>
        <Toolbar>
          <Typography variant="h6">
            Banco de louvor
          </Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="simple tabs example">
          <Tab label="Aprovados" {...a11yProps(0)} />
          <Tab label="Ensaiando" {...a11yProps(1)} />
          <Tab label="Sugestões" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={'x'}
        index={tab}
        className={classes.content}
        onChangeIndex={(index) => handleChangeTab(undefined, index)}>

        {Object.keys(PraiseStatus).map((tabId, index) => (
          <TabPanel value={tab} index={index} showAll={false} key={tabId}>
            {praises.filter(item => item.status === tabId).map((item) => (
              <Card variant="outlined" key={item.id} className={classes.card}>
                <CardActionArea>
                  <CardHeader
                    avatar={
                      <Avatar
                        alt={item.tone}
                        className={classes.tone}
                        onClick={() => handleShowPraiseDetails(item.id)}>
                          {item.tone}
                        </Avatar>
                    }
                    title={
                      <span onClick={() => handleShowPraiseDetails(item.id)}>{item.name}</span>
                    }
                    subheader={
                      <span onClick={() => handleShowPraiseDetails(item.id)}>{item.artist}</span>
                    }

                    // avatar={
                    //   <Avatar alt={item.created_by.name} src={item.created_by.avatar_url}>
                    //     { item.created_by.name.split(' ').map(n => n[0]).slice(0, 2).join('') }
                    //   </Avatar>
                    // }
                    action={auth.isAuthenticated() &&
                      <IconButton
                        aria-label="settings"
                        onClick={(event) => { handleMenuInflate(event, item) }}>
                        <MoreVertIcon />
                      </IconButton>
                    }
                  />
                </CardActionArea>
              </Card>
            ))}

            {praises.filter(item => item.status === tabId).length === 0 && !isLoading && (
              <Typography>
                {[
                  "Não há louvores aprovados",
                  "Não há louvores a serem ensaiados",
                  "Nenhuma sugestão encontrada"
                ][index]}
              </Typography>
            )}
          </TabPanel>
        ))}

        {/* <TabPanel value={tab} index={0}>
          { praises.filter(item => item.status === 'approved').map((item) => (
            <Typography key={item.id}>Item: {item.name}</Typography>
          )) }

          { praises.filter(item => item.status === 'approved').length === 0 && !isLoading && (
            <Typography>
              Não há louvores aprovados
            </Typography>
          ) }
        </TabPanel>

        <TabPanel value={tab} index={1}>
          { praises.filter(item => item.status === 'training').map((item) => (
            <Typography key={item.id}>Item: {item.name}</Typography>
          )) }

          { praises.filter(item => item.status === 'training').length === 0 && !isLoading && (
            <Typography>
              Não há louvores a serem ensaiados
            </Typography>
          ) }
        </TabPanel>

        
        <TabPanel value={tab} index={2}>
          { praises.filter(item => item.status === 'suggestion').map((item) => (
            <Card variant="outlined" key={item.id} className={classes.card}>
              <CardHeader
                avatar={
                  <Avatar alt={item.created_by.name} src={item.created_by.avatar_url}>
                    { item.created_by.name.split(' ').map(n => n[0]).slice(0, 2).join('') }
                  </Avatar>
                }
                action={
                  // <IconButton
                  //   className={clsx(classes.expand, {
                  //     [classes.expandOpen]: item.expanded,
                  //   })}
                  //   onClick={() => {
                  //     // setPraises(praises.map(it => ({
                  //     //   ...it, ...it.id === item.id && {
                  //     //     expanded: !(it.expanded === true),
                  //     //   }
                  //     // })))

                  //     setPraises(praises.map(it => {
                  //       if(it.id === item.id)
                  //         it.expanded = !(it.expanded === true)
                  //       return it
                  //     }))
                  //   }}
                  //   aria-expanded={item.expanded}
                  //   aria-label="show more"
                  // >
                  //   <ExpandMoreIcon />
                  // </IconButton>

                  <IconButton
                    aria-label="settings"
                    onClick={(event) => {
                      setAnchorEl(event.currentTarget);
                    }}>
                    <MoreVertIcon />
                  </IconButton>
                  
                }
                title={item.name}
                subheader={item.artist}
              />
              <CardContent>
                <Chip
                    avatar={<Avatar src={item.created_by.avatar_url} /> }
                    color="primary"
                    size="small"
                    label={"asasdasd"}
                  />

                { item.tags.map(tag => (
                  <Chip
                    key={tag}
                    // avatar={<Avatar>{item.tone}</Avatar>}
                    className={classes.tag}
                    size="small"
                    label={tag}
                  />
                )) }
              </CardContent>

            </Card>
          )) }

          { praises.filter(item => item.status === 'suggestion').length === 0 && !isLoading && (
            <Typography>
              Nenhuma sugestão encontrada
            </Typography>
          ) }
        </TabPanel> */}

      </SwipeableViews>

      <EditPraiseDialog
        open={dialogEditorOpen}
        initialValue={dialogEditorData}
        onClose={handleDialogEditorClose}
        onSave={handleDialogEditorSave}
      />

      {/* <Dialog onClose={handleDialogEditorClose} aria-labelledby="simple-dialog-title" open={dialogEditorOpen}>
        <DialogTitle id="simple-dialog-title">
          { (dialogEditorData.id ? 'Editar' : 'Novo') + ' louvor' }
        </DialogTitle>

        <form onSubmit={handleDialogEditorSave} className={classes.form}>
          <DialogContent>
            <EditPraiseFields value={dialogEditorData} onChange={(p) => setDialogEditorData(p)} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogEditorClose}>Cancelar</Button>
            <Button onClick={() => handleDialogEditorSave(dialogEditorData)} color="primary">Salvar</Button>
          </DialogActions>
        </form>
      </Dialog> */}

      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={() => {
          if (editWithDialog)
            handleDialogEditorInflate(undefined)
          else
            router.push('/praises/new')
        }}>
        <AddIcon />
      </Fab>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>

        {anchorData.status === PraiseStatus.SUGGESTION && (
          <MenuItem onClick={() => handleMenuChangeStatus(anchorData.id, PraiseStatus.REHEARSING)}>Ensaiar</MenuItem>
        )}

        {anchorData.status === PraiseStatus.REHEARSING && (
          <MenuItem onClick={() => handleMenuChangeStatus(anchorData.id, PraiseStatus.APPROVED)}>Aprovar</MenuItem>
        )}

        <MenuItem onClick={() => handleMenuEdit(anchorData)}>Editar</MenuItem>

        <MenuItem onClick={() => { handleMenuRemove(anchorData.id) }}>Remover</MenuItem>
      </Menu>

      <Backdrop variant="loading" open={isLoading}>
        <CircularProgress color={"primary"} />
      </Backdrop>
    </>
  )
}