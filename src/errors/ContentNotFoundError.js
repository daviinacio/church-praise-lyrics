import HttpError from "./HttpError";

export default class ContentNotFoundError extends HttpError {
    constructor(contentLabel){
      super(
        'ERR_CONTENT_NOT_FOUND',
        contentLabel.length > 16 ? contentLabel :
        `There\'s no ${contentLabel} with those parameters`, 400)
    }
  }