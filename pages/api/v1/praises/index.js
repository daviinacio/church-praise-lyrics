import Middleware from '../../../../middlewares/CoreMiddleware'
import { PraiseStatus, PrismaClient } from "@prisma/client"
import vagalume from '../../../../services/vagalume'

import {
  HttpError,
  ContentNotFoundError,
  RouteNotFoundError,
  ValidationFailedError
} from '../../../../src/errors'
import { editPraiseValidator, newPraiseValidator } from '../../../../src/validation/praiseValidator'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  try {
    switch (req.method.trim().toUpperCase()) {
      case 'GET': return await index(req, res)
      case 'POST': return await store(req, res)

      default:
        throw new RouteNotFoundError(req)
    };
  }
  catch (err) {
    if (err instanceof HttpError)
      return res.status(err.status).json(err)
    else throw err
  }
};

// Prisma
const prismaInclude = {
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

export const index = Middleware(['auth:anonymous'], async (req, res) => {
  const { praiseId } = req.query

  if (praiseId) {
    const praise = await prisma.praise.findFirst({
      where: { id: praiseId },
      include: {
        ...prismaInclude,
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
    } else throw new ContentNotFoundError('praise')
  }
  else {
    const count = await prisma.praise.count()
    const praises = await prisma.praise.findMany({
      include: prismaInclude
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
})

export const store = Middleware(['auth:anonymous'], async (req, res, user) => {
  const { name: praise_name, tone = '?', transpose = 0, artist: artist_name, tags = [] } = req.body
  const { force } = req.query

  const validation = newPraiseValidator.values({
    name: praise_name, tone, transpose, artist: artist_name, tags
  }).build()

  if (validation.alright()) {
    const vagalume_result = await vagalume.get('search.php', {
      params: {
        art: artist_name.trim(),
        mus: praise_name.trim(),
        apikey: process.env.VAGALUME_API_KEY
      }
    })
      .then(({ data }) => {
        if ((data.mus && data.art) || force === 'true') return {
          artist: data.art || {
            name: artist_name.trim()
          },
          music: (data.mus || [])[0] || {
            name: praise_name.trim()
          }
        }
        else if (!data.mus) throw new ContentNotFoundError(
          `Não foi possível encontrar a letra desse louvor no site vagalume. Verifique o nome informado, e tente novamente.`
        )
        else if (!data.art) throw new ValidationFailedError({
          artist: 'Cantor não encontrado, por favor verifique e tente novamente'
        })
      })

    const artist = await prisma.artist.upsert({
      create: {
        name: vagalume_result.artist.name || artist_name.trim(),
        vagalume_id: vagalume_result.artist.id
      },
      update: {
        name: vagalume_result.artist.name || artist_name.trim(),
        vagalume_id: vagalume_result.artist.id
      },
      where: {
        name: vagalume_result.artist.name || artist_name.trim(),
        ...vagalume_result.artist.id && {
          vagalume_id: vagalume_result.artist.id
        }
      }
    })

    const praise = await prisma.praise.create({
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
        status: PraiseStatus.SUGGESTION,
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
        ...prismaInclude,
        lyrics: {
          select: {
            content: true
          }
        }
      }
    })
      .catch(err => {
        if (err.code === 'P2002' && err.meta.target.indexOf('unique') >= 0) {
          const field = err.meta.target.split("_")[0]
          throw new ValidationFailedError(Object.fromEntries([[
            field !== 'vagalume' ? field : 'name',
            "Esse louvor já foi adicionado"
          ]]))
        } else throw err
      })

    praise.artist = praise.artist.name
    praise.tags = praise.tags.map(tag => (tag.label))

    return res.status(200).json({
      status: 200,
      result: praise
    })
  }
  else throw new ValidationFailedError(validation.errors)
})

export const update = Middleware(['auth'], async (req, res) => {
  const { name: praise_name, tone, transpose, artist: artist_name, tags = [], status = PraiseStatus.SUGGESTION } = req.body
  const { praiseId } = req.query

  const validation = editPraiseValidator.values({
    name: praise_name, tone, transpose, artist: artist_name, tags, status
  }).build()

  if (validation.alright()) {
    tags.map(async (tag) => {
      await prisma.tag.upsert({
        create: { label: tag.trim() },
        update: { label: tag.trim() },
        where: { label: tag.trim() }
      })
    })

    const target = await prisma.praise.count({
      where: { id: praiseId }
    })

    if (!target)
      throw new ContentNotFoundError('praise')

    const praise = await prisma.praise.update({
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
      include: prismaInclude
    })
      .catch((err) => {
        if (err.code === 'P2002' && err.meta.target.indexOf('unique') >= 0) {
          const field = err.meta.target.split("_")[0]
          throw new ValidationFailedError(Object.fromEntries([[
            field !== 'vagalume' ? field : 'name',
            "Esse louvor já foi adicionado"
          ]]))
        }
        else
          if (err.code === 'P2025') {
            throw new ContentNotFoundError('praise')
          } else throw err
      })

    praise.artist = praise.artist.name
    praise.tags = praise.tags.map(tag => (tag.label))

    // Remove not uses tags
    await prisma.tag.deleteMany({
      where: { praises: { none: {} } }
    })

    return res.status(200).json({
      status: 200,
      result: praise
    })
  }
  else throw new ValidationFailedError(validation.errors)
})

export const destroy = Middleware(['auth'], async (req, res) => {
  const { praiseId } = req.query

  const praise = await prisma.praise.delete({
    where: {
      id: praiseId
    }
  })
    .catch((err) => {
      if (err.code === 'P2025')
        throw new ContentNotFoundError('praise')
    })

  return res.status(200).json({
    status: 200,
    message: `Praise "${praise.name}" was deletes`,
  })
})

export default handler;
