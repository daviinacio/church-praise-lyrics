import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { createSession } from "../../../../controllers/AutnController";
import errors, { UnauthorizedError, UserNotFoundError } from "../../../../src/errors";
import RouteNotFound from "../../404";

const prisma = new PrismaClient()

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'POST': return await login(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const { keep } = req.query

    const user = await prisma.users.findFirst({
      where: { OR: [ { email }, { username: email } ] }
    })

    if(user){
      if(compareSync(password, user.password)){
        const token = await createSession(user, keep === 'true')
        return res.status(200).json({
          status: 200,
          result: token
        })
      }
      else throw {
        ...UnauthorizedError,
        message: "Senha incorreta"
      }
    }
    else throw UserNotFoundError
  }
  catch(ex){
    return res.status(errors.status(ex.code)).json(ex)
  }
}

export default handler