import { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles } from '@material-ui/core/styles'
import SEO from '../../components/SEO'
import TabPanel, { a11yProps } from '../../components/TabPanel'
import axios from 'axios'
import clsx from 'clsx'
import Link from 'next/link'

import {
  AppBar,
  Avatar,
  Backdrop,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  Toolbar,
  Typography
} from '@material-ui/core'

import {
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon
} from '@material-ui/icons'

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    // maxWidth: 500,
    // margin: 'auto'
  },
  content: {
    marginTop: 104,
    minHeight: '-webkit-fill-available'
  },
  card: {
    marginBottom: '7.5px'
  },
  tag: {
    marginRight: '10px'
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '250px'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  backdrop: {
    backgroundColor: 'rgba(250, 250, 250, 0.5)',
    zIndex: 1,
    transition: 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms !important'
  }
}))

export default function PraisesPage() {
  const classes = useStyles();

  // Tabs
  const [tab, setTab] = useState(0)

  useEffect(() => {
    setTab(parseInt(sessionStorage.getItem('praises.tab')) || 0)
  }, [])

  function handleChangeTab(event, newTab){
    setTab(newTab)
    sessionStorage.setItem('praises.tab', newTab)
  }

  // Float menu on list
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorData, setAnchorData] = useState(null)

  function handleInflateMenu(event, data){
    setAnchorEl(event.currentTarget)
    setAnchorData(data)
  }

  function handleCloseMenu(){
    setAnchorEl(null)
    setAnchorData(null)
  }

  function handleChangePraiseStatus(praiseId, newStatus){
    axios.put(`/api/v1/praises/${praiseId}`, {
      status: newStatus
    })

    setPraises(praises.map(praise => {
      if(praise.id === praiseId)
        praise.status = newStatus
      return praise
    }))

    handleCloseMenu()
  }

  function handleRemovePraise(praiseId){
    axios.delete(`/api/v1/praises/${praiseId}`)
    
    setPraises(praises.filter(praise => {
      return praise.id !== praiseId
    }))

    handleCloseMenu()
  }

  // Content data
  const [praises, setPraises] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(async () => {
    const { data } = await axios.get('/api/v1/praises')

    setPraises(data)
    setIsLoading(false)
  }, [])

  return (
    <>
      <SEO title="Louvores" />
      <AppBar>
        <Toolbar className={classes.root}>
          <Typography variant="h6">
            Banco de louvor
          </Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="simple tabs example"
          className={classes.root}>
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
          
          { ['approved', 'training', 'suggestion'].map((tabId, index) => (
            <TabPanel value={tab} index={index} showAll={false} key={tabId}>
              { praises.filter(item => item.status === tabId).map((item) => (
                <Card variant="outlined" key={item.id} className={classes.card}>
                  <CardHeader
                    avatar={
                      <Avatar alt={item.created_by.name} src={item.created_by.avatar_url}>
                        { item.created_by.name.split(' ').map(n => n[0]).slice(0, 2).join('') }
                      </Avatar>
                    }
                    action={
                      <IconButton
                        aria-label="settings"
                        onClick={(event) => { handleInflateMenu(event, item) }}>
                        <MoreVertIcon />
                      </IconButton>
                      
                    }
                    title={item.name}
                    subheader={item.artist}
                  />
                </Card>
              )) }

              { praises.filter(item => item.status === tabId).length === 0 && !isLoading && (
                <Typography>
                  { [
                    "Não há louvores aprovados",
                    "Não há louvores a serem ensaiados",
                    "Nenhuma sugestão encontrada"
                  ][index] }
                </Typography>
              ) }
            </TabPanel>
          )) }

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

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}>

        { (anchorData || {}).status === 'suggestion' && (
          <MenuItem onClick={() => handleChangePraiseStatus(anchorData.id, 'training')}>Ensaiar</MenuItem>
        )}

        { (anchorData || {}).status === 'training' && (
          <MenuItem onClick={() => handleChangePraiseStatus(anchorData.id, 'approved')}>Aprovar</MenuItem>
        )}

        <MenuItem>
          <Link href={`/praises/${(anchorData || {}).id}/edit`}>Editar</Link>
        </MenuItem>

        <MenuItem onClick={() => { handleRemovePraise(anchorData.id) }}>Remover</MenuItem>
      </Menu>
      
      <Backdrop open={isLoading} className={classes.backdrop}>
        <CircularProgress color={"primary"} />
      </Backdrop>
    </>
  )
}