import { PrismaClient } from "@prisma/client"
import { sign, verify } from "jsonwebtoken"
import { AuthTokenExpiredError, AuthTokenInvalidError, UnauthorizedError } from "../src/errors"

const prisma = new PrismaClient

export const getAuthUser = async (authorization, options) => {
  if(!authorization){
    if(options.indexOf("anonymous") === -1)
      throw UnauthorizedError
    else return undefined
  }

  if(authorization.split(' ').length < 2)
    throw AuthTokenInvalidError

  const type = authorization.split(' ')[0].trim()
  const token = authorization.split(' ')[1].trim()

  try {
    const decoded = verify(token, process.env.JWT_SECRET || '')

    if(!decoded.user)
      throw AuthTokenInvalidError;

    const userWithSessions = await prisma.users.findFirst({
      where: {
        id: decoded.user.id,
        is_active: true
      },
      include: {
        sessions: {
          where: {
            type: type,
            token: token,
            inactivated_at: null,
            is_active: true
          }
        }
      }
    })

    userWithSessions.password = undefined
    userWithSessions.session = userWithSessions.sessions[0]
    userWithSessions.sessions = undefined

    if(userWithSessions && userWithSessions.session)
      return userWithSessions
    else throw AuthTokenExpiredError 
  }
  catch(err){
    if((err.name || err.code) && err.name !== 'JsonWebTokenError')
      await killSession(authorization, true);

    throw {
      'TokenExpiredError': AuthTokenExpiredError,
      'JsonWebTokenError': AuthTokenInvalidError,
    } [err.name] || err;
  }
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
      type: "Bearer",
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

export const killSession = async (authorization, suppressNotFound = false) => {
  if(authorization.split(' ').length < 2)
    throw AuthTokenInvalidError

  const type = authorization.split(' ')[0].trim()
  const token = authorization.split(' ')[1].trim()

  const session = await prisma.sessions.findFirst({
    where: { token, type, inactivated_at: null, is_active: true }
  })

  if(session)
    await prisma.sessions.update({
      where: { id: session.id },
      data: {
        inactivated_at: new Date(),
        is_active: false
      }
    })
  else {
    if(suppressNotFound) return;
    else throw AuthTokenInvalidError
  }
}