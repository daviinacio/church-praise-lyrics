import { useEffect, useState } from 'react';
import SEO from '../../components/SEO';
import TabPanel, { a11yProps } from '../../components/TabPanel';
import SwipeableViews from 'react-swipeable-views';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useRouter } from 'next/router';

import {
  AppBar,
  Container,
  Typography,
  Toolbar,
  Tabs,
  Tab,
  makeStyles,
  Card,
  Backdrop,
  CircularProgress,
  CardContent,
  CardActions,
  Button,
  CardActionArea,
  Chip,
  Avatar,
  Fab
} from '@material-ui/core';

import {
  Add as AddIcon
} from '@material-ui/icons'
import { useAPI } from '../../services/api';

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

export default function SchedulePage() {
  const classes = useStyles()
  const router = useRouter()
  const api = useAPI()

  // Date
  function getDateMoment(date) {

  }

  // Tabs
  const [tab, setTab] = useState(1)

  function handleChangeTab(event, newTab) {
    setTab(newTab)
  }

  // Dialog Editor
  function handleDialogEditorInflate(data) {

  }

  // Content data
  const [concerts, setConcerts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async function () {
      await api.get('concerts').then(({ data }) => {
        setConcerts(data)
        setIsLoading(false)
      })
        .catch(() => { })
    })()
  }, [])

  return (
    <>
      <SEO title="Escala" />
      <AppBar>
        <Toolbar>
          <Typography variant="h6">
            Escala de cultos
          </Typography>
        </Toolbar>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          scrollButtons="auto"
          aria-label="simple tabs example">
          <Tab label="Anteriores" {...a11yProps(0)} />
          <Tab label="Hoje" {...a11yProps(1)} />
          <Tab label="Em breve" {...a11yProps(2)} />
        </Tabs>
      </AppBar>

      <SwipeableViews
        axis={'x'}
        index={tab}
        className={classes.content}
        onChangeIndex={(index) => handleChangeTab(undefined, index)}>

        {['past', 'today', 'future'].map((tabId, index) => (
          <TabPanel value={tab} index={index} key={tabId}>
            {concerts.filter(item => item.moment === tabId).map(item => (
              <Card variant="outlined" key={item.id} className={classes.card}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                      {format(new Date(item.date), "'Culto de 'eee' ('dd'/'MM')'", {
                        locale: ptBR
                      })}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      {item.praises.map((praise, index) => (
                        <div key={index}>{praise.name}</div>
                      ))}
                    </Typography>

                    {/* {item.confirmedPresence.map(member => (
                        <Chip
                          avatar={
                            <Avatar>
                              { member.name.split(' ').map(n => n[0]).slice(0, 2).join('') }
                            </Avatar>
                          }
                          label={member.name}
                          size='small'
                          color="primary"
                          onDelete={() => {}}
                          deleteIcon={<DoneIcon />}
                        />
                      ))} */}
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    Confirmar presença
                  </Button>
                  <Button size="small" color="primary">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            ))}

            {concerts.filter(item => item.moment === tabId).length === 0 && !isLoading && (
              <Typography>
                {[
                  "Os cultos passados ficarão aqui",
                  "Nada programado pra hoje",
                  "Nenhum agendamento encontrado"
                ][index]}
              </Typography>
            )}

          </TabPanel>
        ))}

      </SwipeableViews>

      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={() => {
          if (editWithDialog)
            handleDialogEditorInflate(undefined)
          else
            router.push('/schedule/new')
        }}>
        <AddIcon />
      </Fab>

      <Backdrop variant="loading" open={isLoading}>
        <CircularProgress color={"primary"} />
      </Backdrop>
    </>
  )
}
