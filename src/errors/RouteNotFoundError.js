import { NextApiRequest } from "next"
import HttpError from "./HttpError"

export default class RouteNotFoundError extends HttpError {
    route; method
  
    constructor(req){
      super(
        'ERR_ROUTE_NOT_FOUND',
        "The route you trying to access does not exists", 404
      )
      
      const indexOfSlug = req.url.indexOf('others')
      this.route = indexOfSlug >= 0 ? req.url.substr(0, indexOfSlug -1) : req.url
  
      this.method = req.method
    }
  }