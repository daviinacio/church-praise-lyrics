import RouteNotFound from "../404";
import Middleware from '../../../middlewares/CoreMiddleware'
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res);

    default:
      return RouteNotFound(req, res);
  };
};

export const index = Middleware(['cache'], async (req, res) => {
  try {
    const count = await prisma.tags.count()
    const tags = await prisma.tags.findMany()

    res.setHeader('X-Total-Count', count)
    return res.status(200).json({
      status: 200,
      total_count: count,
      result: tags.map(tag => tag.label)
    })
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export default handler;