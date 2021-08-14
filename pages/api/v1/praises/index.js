import RouteNotFound from "../../404";
import { sleep, uuid } from "../../../../src/dev";
import Middleware from '../../../../middlewares/CoreMiddleware'

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res)
    case 'POST': return await store(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const index = Middleware(['auth:anonymous'], async (req, res) => {
  const { praiseId } = req.query

  const praises = []

  for (var i = 0; i < 2; i++){
    praises.push({
      id: "a08fa75f-0c64-46d7-be49-6e63b631e19" + i,
      name: `Projeto no Deserto (0${i})`,
      artist: "Voz da Verdade",
      tags: [
        "adoração", "oferta", "apelo"
      ],
      status: 'approved',
      tone: 'C',
      transpose: 0,
      created_by: {
        name: "Davi Inácio",
        avatar_url: "https://avatars.githubusercontent.com/u/19656901?v=4"
      },
      created_at: "2021/07/07"
    })

    praises.push({
      id: "b08fa75f-0c64-46d7-be49-6e63b631e19" + i,
      name: `Projeto no Deserto (1${i})`,
      artist: "Voz da Verdade",
      tags: [
        "adoração", "oferta"
      ],
      status: 'training',
      tone: 'C#',
      transpose: 0,
      created_by: {
        name: "Davi Inácio",
        avatar_url: "https://avatars.githubusercontent.com/u/19656901?v=4"
      },
      created_at: "2021/07/07"
    })

    praises.push({
      id: "c08fa75f-0c64-46d7-be49-6e63b631e19" + i,
      name: `Projeto no Deserto (2${i})`,
      artist: "Voz da Verdade",
      tags: [
        "adoração", "oferta"
      ],
      status: 'suggestion',
      tone: 'Bb',
      transpose: 0,
      created_by: {
        name: "Davi Inácio",
        avatar_url: "https://avatars.githubusercontent.com/u/19656901?v=4"
      },
      created_at: "2021/07/07"
    })

    praises.push({
      id: "c08fa75f-0c64-46d7-be49-6e63s631e19" + i,
      name: `Projeto no Deserto (3${i})`,
      artist: "Voz da Verdade",
      tags: [
        "adoração", "oferta"
      ],
      status: 'suggestion',
      tone: 'Cm',
      transpose: 0,
      created_by: {
        name: "Davi Inácio Ciconelli Vieira",
        avatar_url: null
      },
      created_at: "2021/07/07"
    })
  }

  // Fake ping mock
  //if(process.env.NODE_ENV === 'development')
  //  await sleep(1000)

  if(praiseId){
    const praise = praises.filter(praise => praise.id == praiseId)

    if(praise.length > 0){
      return res.status(200).json(praise[0])
    }
    else {
      return res.status(400).json({
        message: 'Prase not found'
      })
    }
  }
  else return res.status(200).json(praises)
})

export const store = Middleware(['auth'], async (req, res) => {
  const praise = {
    ...{
      status: 'suggestion',
      name: 'Teste',
      artist: 'Teste',
      created_by: {
        "name": "Davi Inácio"
      },
      tone: '?',
      transpose: 0
    },
    ...req.body,
    id: uuid()
  }

  // Fake ping mock
  //if(process.env.NODE_ENV === 'development')
  //  await sleep(1000)

  console.log('praise.store: ', praise)
  return res.status(200).json(praise)
})

export const update = Middleware(['auth'], async (req, res) => {
  const { praiseId } = req.query
  const { status, name } = req.body

  if(name){
    console.log(`praise.update ${praiseId}: `, req.body)
  }
  else {
    console.log(`praise.update ${praiseId}: status -> ${status}`)
  }

  // Fake ping mock
  //if(process.env.NODE_ENV === 'development')
  //  await sleep(1000)

  return res.status(200).json({
    message: "praise.update"
  })
})

export const destroy = Middleware(['auth'], async (req, res) => {
  const { praiseId } = req.query

  console.log(`praise.destroy ${praiseId}`)

  // Fake ping mock
  //if(process.env.NODE_ENV === 'development')
  //  await sleep(1000)

  return res.status(200).json({
    message: "praise.destroy"
  })
})

export default handler;