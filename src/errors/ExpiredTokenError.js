import HttpError from "./HttpError";

export default class ExpiredTokenError extends HttpError {
    constructor(){
      super(
        'ERR_EXPIRED_TOKEN',
        'Sua sessão expirou\nPor favor, efetue o login novamente.', 401)
    }
  }