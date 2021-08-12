import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { createSession } from "../../../../controllers/AuthController";
import errors, { ValidationFailedError } from "../../../../src/errors";
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
          message: "A new session was created for your account",
          result: {
            token,
            user: {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              avatar_url: user.avatar_url
            }
          }
        })
      }
      else throw {
        ...ValidationFailedError,
        validation: [
          { field: "password", message: "Senha incorreta" }
        ]
      }
    }
    else throw {
      ...ValidationFailedError,
      validation: [
        { field: "email", message: "Membro não encontrado" }
      ]
    }
  }
  catch(ex){
    return res.status(errors.status(ex.code)).json(ex)
  }
}

export default handler