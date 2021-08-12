import { PrismaClient } from "@prisma/client";
import RouteNotFound from "../../404";
import errors, { FutureFeatureError, UserNotFoundError } from "../../../../src/errors"
import Middleware from '../../../../middlewares/CoreMiddleware'

const prisma = new PrismaClient();

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res);
    case 'POST': return await store(req, res);

    default:
      return RouteNotFound(req, res);
  };
};

export const index = Middleware(['auth'], async (req, res) => {
  try {
    const { userId } = req.query;

    if(userId){
      const user = await prisma.users.findFirst({
        where: { id: userId }
      })

      if(user) return res.status(200).json({
        status: 200,
        result: user
      })
      else throw UserNotFoundError
    }
    else {
      const users = await prisma.users.findMany({})

      return res.status(200).json({
        status: 200,
        result: users
      })
    }
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export const store = Middleware(['auth'], async (req, res) => {
  try {
    throw FutureFeatureError
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export const update = Middleware(['auth'], async (req, res) => {
  try {
    throw FutureFeatureError
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export const destroy = Middleware(['auth'], async (req, res) => {
  try {
    throw FutureFeatureError
  }
  catch (ex) {
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export default handler;