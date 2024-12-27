import { PrismaClient } from "@prisma/client"
import { sign, verify } from "jsonwebtoken"
const prisma = new PrismaClient

import {
  InvalidTokenError,
  UnauthorizedError,
  ExpiredTokenError
} from '../src/errors'

export const getAuthUser = async (authorization, options) => {
  if (!authorization) {
    if (options.indexOf("anonymous") === -1)
      throw new UnauthorizedError()
    else return {}
  }

  if (authorization.split(' ').length < 2)
    throw new InvalidTokenError()

  const type = authorization.split(' ')[0].trim()
  const token = authorization.split(' ')[1].trim()

  try {
    const decoded = verify(token, process.env.JWT_SECRET || '')

    if (!decoded.user)
      throw new InvalidTokenError();

    const userWithSessions = await prisma.user.findFirst({
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

    if (userWithSessions) {
      if (userWithSessions.sessions.length > 0) {
        userWithSessions.password = undefined
        userWithSessions.sessions = userWithSessions.sessions[0]
        userWithSessions.sessions = undefined

        return userWithSessions
      } else throw new ExpiredTokenError()
    } else throw new InvalidTokenError()
  }
  catch (err) {
    console.log('here')
    if ((err.name || err.code) && err.name !== 'JsonWebTokenError')
      await killSession(authorization, true);

    throw {
      'TokenExpiredError': new ExpiredTokenError(),
      'JsonWebTokenError': new InvalidTokenError(),
    }[err.name] || err;
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

  const session = await prisma.session.create({
    data: {
      token: token,
      type: "Bearer",
      expires_in: expires_in,
      user_id: user.id,
      inactivated_at: null
    }
  })

  return {
    type: session.type,
    expires_in: session.expires_in,
    assess_token: session.token
  }
}

export const killSession = async (authorization, suppressNotFound = false) => {
  if (authorization.split(' ').length < 2)
    throw new InvalidTokenError()

  const type = authorization.split(' ')[0].trim()
  const token = authorization.split(' ')[1].trim()

  const session = await prisma.session.findFirst({
    where: { token, type, inactivated_at: null, is_active: true }
  })

  if (session)
    await prisma.session.update({
      where: { id: session.id },
      data: {
        inactivated_at: new Date(),
        is_active: false
      }
    })
  else {
    if (suppressNotFound) return;
    else throw new InvalidTokenError()
  }
}
