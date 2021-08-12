import RouteNotFound from "../../404";
import Middleware from '../../../../middlewares/CoreMiddleware'

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res);
    case 'POST': return await store(req, res);

    default:
      return RouteNotFound(req, res);
  };
};

export const index = Middleware(['auth'], async (req, res) => {
  const { concertId } = req.query

  const concerts = []

  for(var i = 0; i < 1; i++){
    concerts.push({
      id: '722bbfbb-e692-416d-9fd5-dd838a0d38a' + i,
      moment: 'past',
      date: '2021-07-11 00:00:00'
    })

    concerts.push({
      id: '722bbfbb-e692-416d-9fd5-dd838a0d38a' + i,
      moment: 'past',
      date: '2021-07-14 00:00:00'
    })

    concerts.push({
      id: '722bbfbb-e692-416d-9fd5-dd838a0d38a' + i,
      moment: 'today',
      date: '2021-07-18 00:00:00'
    })

    concerts.push({
      id: '722bbfbb-e692-416d-9fd5-dd838a0d38a' + i,
      moment: 'future',
      date: '2021-07-21 00:00:00'
    })

    concerts.push({
      id: '722bbfbb-e692-416d-9fd5-dd838a0d38a' + i,
      moment: 'future',
      date: '2021-07-25 00:00:00'
    })
  }

  concerts.map(e => {
    e.praises = [{
      id: "a08fa75f-0c64-46d7-be49-6e63b631e192",
      name: `Projeto no Deserto (00)`,
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
    },
    {
      id: "b08fa75f-0c64-46d7-be49-6e63b631e192",
      name: `Projeto no Deserto (10)`,
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
    },
    {
      id: "c08fa75f-0c64-46d7-be49-6e63b631e192",
      name: `Projeto no Deserto (20)`,
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
    },
    {
      id: "c08fa75f-0c64-46d7-be49-6e63s631e192",
      name: `Projeto no Deserto (30)`,
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
    }]

    e.confirmedPresence = [
      {
        name: "Davi Inácio"
      }
    ]

    return e
  })

  if(concertId){
    const concert = concerts.filter(concert => concert.id === concertId)[0]

    if(concert){
      return res.status(200).json(concert)
    }
    else {
      return res.status(400).json({
        message: 'Prase not found'
      })
    }
  }
  else return res.status(200).json(concerts)
})

export const store = Middleware(['auth'], async (req, res) => {
  return res.status(200).json({
    message: "concert.store"
  })
})

export const update = Middleware(['auth'], async (req, res) => {
  return res.status(200).json({
    message: "concert.update"
  })
})

export const destroy = Middleware(['auth'], async (req, res) => {
  return res.status(200).json({
    message: "concert.destroy"
  })
})

export default handler;