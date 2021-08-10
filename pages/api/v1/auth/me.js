import Middleware from "../../../../middlewares/CoreMiddleware";

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'POST': return await me(req, res)

    default:
      return RouteNotFound(req, res)
  };
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