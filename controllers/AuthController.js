import { PrismaClient } from "@prisma/client"
import { sign } from "jsonwebtoken"
import { AuthTokenInvalidError } from "../src/errors"

const prisma = new PrismaClient

export const getAuthUser = (authorization) => {

}

export const createSession = async (user, keep) => {
  const secret = process.env.JWT_SECRET || ''
  const expires_in = keep ?
    parseInt(process.env.JWT_TTL_KEEP || "2592000") :
    parseInt(process.env.JWT_TTL || "3600")

  const token = sign({
    user: { id: user.id }
  }, secret, expires_in ? { expiresIn: expires_in } : {})

  const session = await prisma.sessions.create({
    data: {
      token: token,
      type: "bearer",
      expires_in: expires_in,
      user_id: user.id,
    }
  })

  return {
    type: session.type,
    expires_in: session.expires_in,
    assess_token: session.token
  }
}

export const killSession = async (jwt_token) => {
  if(jwt_token.split(' ').length < 2)
    throw AuthTokenInvalidError

  const type = jwt_token.split(' ')[0]
  const token = jwt_token.split(' ')[1]

  const session = await prisma.sessions.findFirst({
    where: { token, type: type.toLowerCase(), inactivated_at: null, is_active: true }
  })

  if(session)
    await prisma.sessions.update({
      where: { id: session.id },
      data: {
        inactivated_at: new Date(),
        is_active: false
      }
    })
  else throw AuthTokenInvalidError
}