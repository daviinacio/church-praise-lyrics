import Middleware from '../../../middlewares/CoreMiddleware'
import { PrismaClient } from "@prisma/client";
import { HttpError, RouteNotFoundError } from "../../../src/errors";

const prisma = new PrismaClient

const handler = async (req, res) => {
  try {
    switch (req.method.trim().toUpperCase()) {
      case 'GET': return await index(req, res);

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

export const index = Middleware(['cache'], async (req, res) => {
  const count = await prisma.tag.count()
  const tags = await prisma.tag.findMany()

  res.setHeader('X-Total-Count', count)
  return res.status(200).json({
    status: 200,
    total_count: count,
    result: tags.map(tag => tag.label)
  })
})

export default handler;
