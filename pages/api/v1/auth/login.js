import { PrismaClient } from "@prisma/client";
import { compareSync } from "bcryptjs";
import { createSession } from "../../../../controllers/AuthController";

import {
  HttpError,
  RouteNotFoundError,
  ValidationFailedError
} from '../../../../src/errors'

const prisma = new PrismaClient()

const handler = async (req, res) => {
  try {
    switch (req.method.trim().toUpperCase()) {
      case 'POST': return await login(req, res)

      default:
        return RouteNotFoundError(req)
    };
  }
  catch (err) {
    if (err instanceof HttpError)
      return res.status(err.status).json(err)
    else throw err
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body
  const { keep } = req.query

  const user = await prisma.user.findFirst({
    where: { OR: [{ email }, { username: email }] }
  })

  if (user) {
    if (compareSync(password, user.password)) {
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
    else throw new ValidationFailedError({
      password: "A senha informada está incorreta"
    })
  }
  else throw new ValidationFailedError({
    email: "Membro não encontrado"
  })
}

export default handler
