import HttpError from "./HttpError";

export default class UnauthorizedError extends HttpError {
    constructor(){
      super(
        'ERR_UNAUTHORIZED',
        'You need authorization to access this endpoint', 401)
    }
  }