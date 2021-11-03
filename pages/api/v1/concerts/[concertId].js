import { HttpError, RouteNotFoundError } from '../../../../src/errors';
import { index, update, destroy } from './index';

const handler = async (req, res) => {
  try {
    switch(req.method.trim().toUpperCase()){
      case 'GET': return await index(req, res);
      case 'PUT': return await update(req, res);
      case 'DELETE': return await destroy(req, res);
  
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

export default handler;