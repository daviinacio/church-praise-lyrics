import { PrismaClient } from "@prisma/client"
import { sign } from "jsonwebtoken"

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

export const killSession = (token) => {
  
}