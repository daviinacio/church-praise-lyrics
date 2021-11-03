import { PrismaClient } from "@prisma/client";
import Middleware from '../../../../middlewares/CoreMiddleware'
import { ContentNotFoundError, HttpError, NotImplementedError, RouteNotFoundError } from "../../../../src/errors";

const prisma = new PrismaClient();

const handler = async (req, res) => {
  try {
    switch(req.method.trim().toUpperCase()){
      case 'GET': return await index(req, res);
      case 'POST': return await store(req, res);
  
      default:
        throw new RouteNotFoundError(req)
    };
  }
  catch(err){
    if(err instanceof HttpError)
      return res.status(err.status).json(err)
    else throw err
  }
};

export const index = Middleware(['auth'], async (req, res) => {
  const { userId } = req.query;

  if(userId){
    const user = await prisma.users.findFirst({
      where: { id: userId }
    })

    if(user) return res.status(200).json({
      status: 200,
      result: user
    })
    else throw ContentNotFoundError('user')
  }
  else {
    const users = await prisma.users.findMany({})

    return res.status(200).json({
      status: 200,
      result: users
    })
  }
})

export const store = Middleware(['auth'], async (req, res) => {
  throw new NotImplementedError()
})

export const update = Middleware(['auth'], async (req, res) => {
  throw new NotImplementedError()
})

export const destroy = Middleware(['auth'], async (req, res) => {
  throw new NotImplementedError()
})

export default handler;