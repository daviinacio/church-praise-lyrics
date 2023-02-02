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
import ContentError from '../../components/ContentError'

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
  },
  cardItem: {
    '&:disabled': {
      background: 'grey'
    }
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
      .catch((err) => {
        snackbar(err.response.data.message, 'error')
      })
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
      setPraises([...praises, {
        ...data,
        loadingLyricsPage: true
      }])

      fetch(`/praises/${data.id}`).then(() => {
        setPraises([...praises, data])
      })
    }

    setDialogEditorData({})
  }

  function handleDialogEditorClose() {
    setDialogEditorOpen(false)
  }

  // Content data
  const [praises, setPraises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hadError, setHadError] = useState(false)

  useEffect(() => {
    (async function () {
      await api.get('praises').then(({ data }) => {
        const { result } = data
        setPraises(result)
        setIsLoading(false)
        setHadError(false)
      })
        .catch((error) => {
          setIsLoading(false)
          setHadError(true)
        })
    })()
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

      {!hadError ? (
        <SwipeableViews
          axis={'x'}
          index={tab}
          className={classes.content}
          onChangeIndex={(index) => handleChangeTab(undefined, index)}>

          {["APPROVED", "REHEARSING", "SUGGESTION"].map((tabId, index) => (
            <TabPanel value={tab} index={index} showAll={false} key={tabId}>
              {praises.filter(item => item.status === tabId).map((item) => (
                <Card variant="outlined" key={item.id} className={classes.card}>
                  <CardActionArea className={classes.cardItem} disabled={item.loadingLyricsPage === true}>
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
        </SwipeableViews>
      ) : <ContentError className={classes.content} />}

      <EditPraiseDialog
        open={dialogEditorOpen}
        initialValue={dialogEditorData}
        onClose={handleDialogEditorClose}
        onSave={handleDialogEditorSave}
      />

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

        {anchorData.status === "SUGGESTION" && (
          <MenuItem onClick={() => handleMenuChangeStatus(anchorData.id, "REHEARSING")}>Ensaiar</MenuItem>
        )}

        {anchorData.status === "REHEARSING" && (
          <MenuItem onClick={() => handleMenuChangeStatus(anchorData.id, "APPROVED")}>Aprovar</MenuItem>
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
