import HttpError from "./HttpError"

export default class ValidationFailedError extends HttpError {
  validation

  constructor(validation){
    super(
      'ERR_VALIDATION_FAILED',
      'Some input data was failed on validation', 400
    )
    
    this.validation = validation
  }
}