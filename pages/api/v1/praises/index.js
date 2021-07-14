import RouteNotFound from "../../404";
import { sleep } from "../../../../src/dev";

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res)
    case 'POST': return await store(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const index = async (req, res) => {
  const { praiseId } = req.query

  const praises = []

  for (var i = 0; i < 4; i++){
    praises.push({
      id: "a08fa75f-0c64-46d7-be49-6e63b631e19" + i,
      name: `Projeto no Deserto (0${i})`,
      artist: "Voz da Verdade",
      tags: [
        "adoração", "oferta"
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
      tone: 'C',
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
      tone: 'C',
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
      tone: 'C',
      transpose: 0,
      created_by: {
        name: "Davi Inácio Ciconelli Vieira",
        avatar_url: null
      },
      created_at: "2021/07/07"
    })
  }

  

  if(praiseId){console.log(34)
    const praise = praises.filter(praise => praise.id == praiseId)

    if(praise.length > 0)
      return res.status(200).json(praise[0])
    else
      return res.status(400).json({
        message: 'Prase not found'
      })
  }
  else return res.status(200).json(praises)
}

export const store = async (req, res) => {
  console.log('praise.store')
  return res.status(200).json({
    message: "praise.store"
  })
}

export const update = async (req, res) => {
  const { praiseId } = req.query
  const { status } = req.body

  console.log(`praise.update ${praiseId}: status -> ${status}`)
  return res.status(200).json({
    message: "praise.update"
  })
}

export const destroy = async (req, res) => {
  const { praiseId } = req.query

  console.log(`praise.destroy ${praiseId}`)
  return res.status(200).json({
    message: "praise.destroy"
  })
}

export default handler;