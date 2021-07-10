import SEO from '../../components/SEO';

import { 
  AppBar, Container, Typography, Toolbar, Tabs, Tab
} from '@material-ui/core';
import { useState } from 'react';
import TabPanel, { a11yProps } from '../../components/TabPanel';

export default function SchedulePage() {
  const [tab, setTab] = useState(1)

  function handleChangeTab(event, newTab){
    setTab(newTab)
  }

  return (
    <>
      <SEO title="Escala" />
      <AppBar position="static">
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

      <TabPanel value={tab} index={0}>
        <Typography>Item One tr</Typography>
      </TabPanel>

      <TabPanel value={tab} index={1}>
        
      </TabPanel>
      
      <TabPanel value={tab} index={2}>
        <Typography>Item Three r</Typography>
      </TabPanel>
    </>
  )
}
