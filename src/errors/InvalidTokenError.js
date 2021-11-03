import HttpError from "./HttpError";

export default class InvalidTokenError extends HttpError {
    constructor(){
      super(
        'ERR_INVALID_TOKEN',
        'Your token is not valid', 401)
    }
  }