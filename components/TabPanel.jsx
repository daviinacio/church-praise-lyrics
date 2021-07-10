import { Box, Container, Typography } from "@material-ui/core";

export default function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Container style={{ paddingTop: '16px', paddingBottom: '56px' }}>
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