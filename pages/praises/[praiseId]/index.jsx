import { PrismaClient } from "@prisma/client"
import SEO from "../../../components/SEO"
import {
  makeStyles,
  Toolbar,
  AppBar,
  Typography,
  Container,
  Box
} from "@material-ui/core"

import api from '../../../services/api'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 15,
    paddingBottom: 56 + 15,
    minHeight: '-webkit-fill-available'
  },
  praise_name: {
    fontWeight: "bold",
    fontSize: '1.8rem',
    lineHeight: 1
  },
  artist_name: {
    fontWeight: "bold",
    fontSize: '1.3rem',
  },
  lyrics_container: {
  },
  lyrics_line: {

  },
  lyrics_block: {
    paddingTop: 15
  }
}))

export default function PraisePage({ data }) {
  const classes = useStyles()

  if (data) {
    return (
      <>
        <SEO title={`${data.name} - ${data.artist}`} />
        {/* <AppBar>
          <Toolbar>
            <Typography variant="h6">
              Letra do louvor
            </Typography>
          </Toolbar>
        </AppBar> */}

        <Container className={classes.root}>
          {data.lyrics ?
            <Box>
              <Typography className={classes.praise_name}>{data.name}</Typography>
              <Typography className={classes.artist_name} color="primary">{data.artist}</Typography>

              <Box className={classes.lyrics_container}>
                {data.lyrics.content.split('\n\n').map((block, index) => (
                  <Box className={classes.lyrics_block} key={index}>
                    {block.split('\n').map((line, index) => (
                      <Typography className={classes.lyrics_line} key={index}>
                        {line}
                      </Typography>
                    ))}
                  </Box>
                ))}
              </Box>
            </Box>
            :
            <Box>
              <Typography>A letra não foi encontrada</Typography>
            </Box>
          }
        </Container>
      </>
    )
  }
  else return <h1>Letra não encontrada</h1>
}

export async function getServerSideProps({ query: { praiseId }, res }) {
  try {
    const { data } = await api.get(`/praises/${praiseId}`)

    //res.setHeader('Cache-Control', `s-maxage=${ process.env.CACHE_MAXAGE || 60 }, stale-while-revalidate`)

    return {
      props: {
        data: data.result
      }
    }
  }
  catch (err) {
    return {
      props: {
        data: {}
      }
    }
  }
}

// PraisePage.getInitialProps = async ({ query: { praiseId }, res }) => {
//   const { data } = await api.get(`/praises/${praiseId}`)

//   //res.setHeader('Cache-Control', `s-maxage=${ process.env.CACHE_MAXAGE || 60 }, stale-while-revalidate`)

//   return {
//     data: data.result
//   }
// }
