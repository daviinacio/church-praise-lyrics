import RouteNotFound from "../../404";

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res)
    case 'POST': return await store(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const index = async (req, res) => {
  const praises = [];

  for (var i = 0; i < 4; i++){
    praises.push({
      id: "a08fa75f-0c64-46d7-be49-6e63b631e19" + i,
      name: "Projeto no Deserto (Aprovado)",
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
      name: "Projeto no Deserto (Treinando)",
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
      name: "Projeto no Deserto",
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
      name: "Projeto no Deserto",
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

  return res.status(200).json(praises)
}

export const store = async (req, res) => {
  return res.status(200).json({
    message: "praise.store"
  })
}

export const update = async (req, res) => {
  return res.status(200).json({
    message: "praise.update"
  })
}

export const destroy = async (req, res) => {
  return res.status(200).json({
    message: "praise.destroy"
  })
}

export default handler;