import { index, update, destroy } from './index';
import RouteNotFound from "../../404";

const handler = async (req, res) => {
  switch(req.method.trim().toUpperCase()){
    case 'GET': return await index(req, res);
    case 'PUT': return await update(req, res);
    case 'DELETE': return await destroy(req, res);

    default:
      return RouteNotFound(req, res);
  };
};

export default handler;