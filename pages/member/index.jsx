import SEO from '../../components/SEO';

import { 
  AppBar, Container, Typography, Toolbar
} from '@material-ui/core';

export default function MemberPage() {
  return (
    <>
      <SEO title="Membro" />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Membro
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}
