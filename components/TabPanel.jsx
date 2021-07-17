import { Box, Container, Typography } from "@material-ui/core";

export default function TabPanel(props) {
  const { children, value, index, showAll = false, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index && !showAll}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      { (value === index || showAll) && (
        <Container style={{ paddingTop: 6, paddingBottom: 6 }}>
          {children}
        </Container>
        
        // <Box p={2} style={{padding: '16px'}}>
        //   {children}
        // </Box>
      )}
    </div>
  );
}

export function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}