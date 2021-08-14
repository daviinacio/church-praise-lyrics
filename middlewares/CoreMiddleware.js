import { getAuthUser } from "../controllers/AuthController"
import errors from "../src/errors"

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
  catch(ex){
    return res.status(errors.status(ex.code)).json(ex)
  }
}

export default Middleware