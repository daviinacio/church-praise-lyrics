import { killSession } from "../../../../controllers/AuthController";
import Middleware from "../../../../middlewares/CoreMiddleware";
import errors from "../../../../src/errors";

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'POST': return await logout(req, res)

    default:
      return RouteNotFound(req, res)
  };
};

export const logout = Middleware(["auth"], async (req, res) => {
  try {
    const { authorization } = req.headers
    await killSession(authorization)
    return res.status(200).json({
      status: 200,
      message: "Your session was finished"
    })
  }
  catch(ex){
    return res.status(errors.status(ex.code)).json(ex)
  }
})

export default handler