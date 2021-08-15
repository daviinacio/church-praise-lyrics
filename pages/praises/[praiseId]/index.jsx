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

export default function PraisePage({ data }){
  const classes = useStyles()
  
  if(data) {
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
                {data.lyrics.content.split('\n\n').map(block => (
                  <Box className={classes.lyrics_block}>
                    {block.split('\n').map(line => (
                      <Typography className={classes.lyrics_line}>
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
  else return <h1>Não encontrado</h1>
}

export async function getStaticPaths() {
  //const { data: praises } = await api.get(`praises`)
  const prisma = new PrismaClient()

  const praises = await prisma.praises.findMany({
    select: {
      id: true
    }
  })

  return {
    paths: praises.map(praise => ({
      params: { praiseId: praise.id }
    })),
    fallback: true
  }
}

export async function getStaticProps(context){
  try {
    // const { data } = await api.get(`praises`)
    const prisma = new PrismaClient()
    const praise = await prisma.praises.findFirst({
      where: {
        id: context.params.praiseId
      },
      include: {
          artist: {
            select: {
              name: true
            }
          },
          tags: {
            select: {
              label: true
            }
          },
          suggested_by: {
            select: {
              name: true,
              username: true,
              avatar_url: true
            }
          },
          lyrics: {
            select: {
              content: true
            }
          }
        }
    })
    .then(result => (
      JSON.parse(JSON.stringify(result))
    ))

    praise.artist = praise.artist.name
    praise.tags = praise.tags.map(tag => (tag.label))

    return {
      props: {
        data: praise
      }
    }
  }
  catch(error){
    return {
      error
    }
  }
}