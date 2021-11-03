import HttpError from "./HttpError";

export default class NotImplementedError extends HttpError {
    constructor(){
      super(
        'ERR_NOT_IMPLEMENTED',
        'Essa funcionalidade ainda não foi desenvolvida', 501)
    }
  }