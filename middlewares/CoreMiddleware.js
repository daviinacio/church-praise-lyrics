import { getAuthUser } from "../controllers/AuthController"
import { HttpError } from "../src/errors"

const Middleware = (middlewares, fn) => async (req, res) => {
  try {
    const hasMiddleware = (key) => {
      return middlewares.filter(md => md.indexOf(key) >= 0).length > 0
    }

    const extractOptions = (key) => {
      return middlewares.filter(md => md.indexOf(key) >= 0)[0]
        .split(':').filter(md => md !== key)
    }

    // Authentication Middleware
    const user = hasMiddleware("auth") ?
      await getAuthUser(req.headers.authorization, extractOptions("auth")) : undefined

    return fn(req, res, user)
  }
  catch(err){
    if(err instanceof HttpError)
      return res.status(err.status).json(err)
    else throw err
  }
}

export default Middleware