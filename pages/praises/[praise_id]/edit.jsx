import SEO from '../../../components/SEO'
import { useRouter } from 'next/router'

import { 
  AppBar, Container, Typography, Toolbar
} from '@material-ui/core'

export default function EditPraisePage() {
  const router = useRouter()
  const praiseId = router.query.praise_id

  const pageTitle = praiseId ? "Editar louvor" : "Novo louvor"

  return (
    <>
      <SEO title={pageTitle} />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            {pageTitle}
          </Typography>
        </Toolbar>
      </AppBar>
    </>
  )
}
