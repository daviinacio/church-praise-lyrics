import Middleware from "../../../../middlewares/CoreMiddleware";
import { HttpError, RouteNotFoundError } from "../../../../src/errors";

const handler = async (req, res) => {
  try {
    switch(req.method.trim().toUpperCase()){
      case 'POST': return await me(req, res)

      default:
        throw new RouteNotFoundError(req)
    };
  }
  catch(err){
    if(err instanceof HttpError)
      return res.status(err.status).json(err)
    else throw err
  }
};

export const me = Middleware(["auth"], async (req, res, user) => {
  return res.status(200).json({
    status: 200,
    result: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar_url: user.avatar_url
    }
  })
})

export default handler