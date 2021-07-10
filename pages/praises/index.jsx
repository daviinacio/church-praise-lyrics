import { useEffect, useState } from 'react'
import SwipeableViews from 'react-swipeable-views'
import { makeStyles } from '@material-ui/core/styles'
import SEO from '../../components/SEO'
import TabPanel, { a11yProps } from '../../components/TabPanel'
import axios from 'axios'
import clsx from 'clsx'

import { AppBar,
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

  card: {
    marginBottom: '15px'
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
  }
}))

export default function PraisesPage() {
  const classes = useStyles();

  const [tab, setTab] = useState(0)
  const [praises, setPraises] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  }

  function handleChangeTab(event, newTab){
    setTab(newTab)
  }

  const handleChangeIndex = (index) => {
    setTab(index);
  }

  useEffect(async () => {
    const { data } = await axios.get('/api/v1/praises')

    setPraises(data)
    setIsLoading(false)
  }, [])
  
  return (
    <>
      <SEO title="Louvores" />
      <AppBar position="sticky">
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
        onChangeIndex={handleChangeIndex}>

          {/* { ['approved', 'training', 'suggestion'].map((tabId, index) => (
            <TabPanel value={tab} index={index}>
              { praises.filter(item => item.status === tabId).map((item) => (
                <Card variant="outlined">
                  <CardContent>
                    
                  </CardContent>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe">
                        R
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title="Shrimp and Chorizo Paella"
                    subheader="September 14, 2016"
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
          )) } */}

        <TabPanel value={tab} index={0}>
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
        </TabPanel>

      </SwipeableViews>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}>
        <MenuItem>Profile</MenuItem>
        <MenuItem>My account</MenuItem>
        <MenuItem>Logout</MenuItem>
      </Menu>
      
      <Backdrop open={isLoading}>
        <CircularProgress color={"secondary"} />
      </Backdrop>
    </>
  )
}