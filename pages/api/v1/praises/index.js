import RouteNotFound from "../../404"
import { sleep, uuid } from "../../../../src/dev";
import Middleware from '../../../../middlewares/CoreMiddleware'
import { PraiseStatus, PrismaClient } from "@prisma/client"
import errors, { LyricsNotFoundError, PraiseNotFoundError, SqlDuplicatedEntryError, ValidationFailedError } from "../../../../src/errors"
import vagalume from '../../../../services/vagalume'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  switch (req.method.trim().toUpperCase()) {
    case 'GET': return await index(req, res)
    case 'POST': return await store(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const index = Middleware(['auth:anonymous'], async (req, res) => {
  try {
    const { praiseId } = req.query

    if (praiseId) {
      const praise = await prisma.praises.findFirst({
        where: { id: praiseId },
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

      if (praise) {
        praise.artist = praise.artist.name
        praise.tags = praise.tags.map(tag => (tag.label))

        return res.status(200).json({
          status: 200,
          result: praise
        })
      } else throw PraiseNotFoundError
    }
    else {
      const count = await prisma.praises.count()
      const praises = await prisma.praises.findMany({
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
          }
        }
      })

      praises.forEach((value, index) => {
        praises[index].artist = praises[index].artist.name
        praises[index].tags = praises[index].tags.map(tag => (tag.label))
      })

      res.setHeader('X-Total-Count', count)
      return res.status(200).json({
        status: 200,
        total_count: count,
        result: praises,
      })
    }
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export const store = Middleware(['auth:anonymous'], async (req, res, user) => {
  try {
    const { name: praise_name, tone, transpose, artist: artist_name, tags = [] } = req.body
    const { force } = req.query

    const validation = {}

    if(typeof praise_name !== 'string' || praise_name === '')
      validation.name = "Informe o nome do louvor"

    if(typeof artist_name !== 'string' || artist_name === '')
      validation.artist = "Informe o nome do(a) cantor(a)"

    if(Object.keys(validation).length > 0) throw {
      ...ValidationFailedError, validation
    }

    const vagalume_result = await vagalume.get('search.php', {
      params: {
        art: artist_name.trim(),
        mus: praise_name.trim()
      }
    })
    .then(({ data }) => {
      if(data.mus || force === 'true') return {
        artist: data.art || {},
        music: (data.mus || [])[0] || {}
      }
      else throw LyricsNotFoundError
    })

    const artist = await prisma.artists.upsert({
      create: {
        name: vagalume_result.artist.name || artist_name.trim(),
        vagalume_id: vagalume_result.artist.id
      },
      update: { 
        name: vagalume_result.artist.name || artist_name.trim(),
        vagalume_id: vagalume_result.artist.id
      },
      where: {
        name: vagalume_result.artist.name || artist_name.trim()
      }
    })

    console.log("[api.Praises.store]::vagalume_result", vagalume_result)

    const praise = await prisma.praises.create({
      data: {
        name: vagalume_result.music.name || praise_name.trim(),
        vagalume_id: vagalume_result.music.id,
        artist: {
          connect: {
            id: artist.id
          }
        },
        ...user.id && {
          suggested_by: {
            connect: {
              id: user.id
            }
          }
        },
        status: "SUGGESTION",
        transpose,
        tone,
        ...vagalume_result.music.text && {
          lyrics: {
            create: {
              content: vagalume_result.music.text
            }
          }
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            create: { label: tag.trim() },
            where: { label: tag.trim() }
          }))
        }
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
    .catch(err => {
      if(err.code === 'P2002' && err.meta.target.indexOf('unique') >= 0){
        const field = err.meta.target.split("_")[0]
        throw {
          ...ValidationFailedError,
          validation: Object.fromEntries([[
            field !== 'vagalume' ? field : 'name',
            "Esse louvor já foi adicionado"
          ]])
        };
      } else throw err
    })

    console.log("[api.Praises.store]::praise", praise)

    praise.artist = praise.artist.name
    praise.tags = praise.tags.map(tag => (tag.label))

    return res.status(200).json({
      status: 200,
      result: praise
    })
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export const update = Middleware(['auth'], async (req, res) => {
  try {
    const { name: praise_name, tone, transpose, artist: artist_name, tags = [], status = PraiseStatus.SUGGESTION } = req.body
    const { praiseId } = req.query

    const validation = {}

    if(typeof praise_name === 'string' && praise_name === '')
      validation.name = "Informe o nome do louvor"

    if(typeof artist_name === 'string' && artist_name === '')
      validation.artist = "Informe o nome do(a) cantor(a)"

    if(Object.keys(validation).length > 0) throw {
      ...ValidationFailedError, validation
    }
    
    tags.map(async (tag) => {
      await prisma.tags.upsert({
        create: { label: tag.trim() },
        update: { label: tag.trim() },
        where: { label: tag.trim() }
      })
    })

    const target = await prisma.praises.count({
      where: { id: praiseId }
    })

    if(!target)
      throw PraiseNotFoundError

    const praise = await prisma.praises.update({
      where: {
        id: praiseId
      },
      data: {
        name: praise_name,
        tone: tone, 
        transpose: transpose,
        status: status,
        ...artist_name && {
          artist: {
            update: {
              name: artist_name
            }
          },
        },
        tags: {
          set: tags.map((tag) => ({
            label: tag.trim()
          })),
        }
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
        }
      }
    })
    .catch((err) => {
      // if(err.code === 'P2002' && err.meta.target.indexOf('unique') >= 0){
      //   const field = err.meta.target.split("_")[0]
      //   throw {
      //     ...ValidationFailedError,
      //     validation: Object.fromEntries([[
      //       field !== 'vagalume' ? field : 'name',
      //       "Esse louvor já foi adicionado"
      //     ]])
      //   };
      // }
      // else
      if(err.code === 'P2025'){
        throw PraiseNotFoundError
      } else throw err
    })

    praise.artist = praise.artist.name
    praise.tags = praise.tags.map(tag => (tag.label))
    
    return res.status(200).json({
      status: 200,
      result: praise
    })
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export const destroy = Middleware(['auth'], async (req, res) => {
  try {
    const { praiseId } = req.query

    const praise = await prisma.praises.delete({
      where: {
        id: praiseId
      }
    })
    .catch((err) => {
      if(err.code === 'P2025')
        throw PraiseNotFoundError
    })

    return res.status(200).json({
      status: 200,
      message: `Praise "${praise.name}" was deletes`,
    })
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export default handler;