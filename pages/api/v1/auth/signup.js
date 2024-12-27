import { HttpError, RouteNotFoundError, ValidationFailedError } from "../../../../src/errors"
import { normalizeTextIdentifier } from "../../../../src/utils"
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import signupValidation from "../../../../src/validation/signupValidation";

const prisma = new PrismaClient()

const handler = async (req, res) => {
  try {
    switch (req.method.trim().toUpperCase()) {
      case 'POST': return await signup(req, res)

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

export const signup = async (req, res) => {
  const { name, username: rawUsername, email, password: rawPassword, avatar_url } = req.body

  // Validation
  const validation = signupValidation.values({
    name, username: rawUsername, email, password: rawPassword
  }).build()

  if (validation.alright()) {
    // Convert input values
    const username = normalizeTextIdentifier(rawUsername)
    const password = hashSync(rawPassword, process.env.HASH_SALT || 10);
    const sys_admin = await prisma.user.count() === 0

    // Database validation
    const findUserByEmail = await prisma.user.findFirst({ where: { email } })
    const findUserByUsername = await prisma.user.findFirst({ where: { username } })

    if (findUserByEmail || findUserByUsername) {
      throw new ValidationFailedError({
        ...findUserByEmail && {
          email: "Esse email já está associado a um membro"
        },
        ...findUserByUsername && {
          username: "Já existe um membro com esse username"
        }
      })
    }

    const createdUser = await prisma.user.create({
      data: { name, username, email, password, avatar_url, sys_admin }
    })

    return res.status(200).json({
      status: 200,
      message: "Seu login foi criado com sucesso! Agora, use o email e senha informados para entrar.",
      result: createdUser
    })
  }
  else throw new ValidationFailedError(validation.errors)
}

export default handler
