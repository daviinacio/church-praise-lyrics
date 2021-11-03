import { killSession } from "../../../../controllers/AuthController";
import Middleware from "../../../../middlewares/CoreMiddleware";
import { HttpError, RouteNotFoundError } from "../../../../src/errors";

const handler = async (req, res) => { 
  try {
    switch(req.method.trim().toUpperCase()){
      case 'POST': return await logout(req, res)

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

export const logout = Middleware(["auth"], async (req, res) => {
  const { authorization } = req.headers
  
  await killSession(authorization)

  return res.status(200).json({
    status: 200,
    message: "Your session was finished"
  })
})

export default handler