import errors, { ValidationFailedError } from "../../../../src/errors"
import { normalizeTextIdentifier } from "../../../../src/utils"
import { PrismaClient } from "@prisma/client";
import RouteNotFound from "../../404";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient()

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'POST': return await signup(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const signup = async (req, res) => {
  try {
    const { name, username:rawUsername, email, password:rawPassword, avatar_url } = req.body

    // Convert input values
    const username = normalizeTextIdentifier(rawUsername)
    const password = hashSync(rawPassword, process.env.HASH_SALT || 10);
    const sys_admin = await prisma.users.count() === 0

    // Validation
    // TODO: Refactor validation
    const validationFails = []

    const findUserByEmail = await prisma.users.findFirst({ where: { email } })
    const findUserByUsername = await prisma.users.findFirst({ where: { username } })
    
    if(findUserByEmail)
      validationFails.push({ field: "email", type: "unique" })

    if(findUserByUsername)
      validationFails.push({ field: "username", type: "unique" })

    if(validationFails.length > 0)
      throw { ...ValidationFailedError, validation: validationFails }

    // Create new user
    const createdUser = await prisma.users.create({
      data: { name, username, email, password, avatar_url, sys_admin }
    })

    return res.status(200).json({
      status: 200,
      result: createdUser
    })
  }
  catch(ex){
    return res.status(errors.status(ex.code)).json(ex)
  }
}

export default handler