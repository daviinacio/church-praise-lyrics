export default class HttpError extends Error {
  code; message; status = 501;

  constructor(code, message, status){
    super(message)
    this.code = code
    this.message = message
    this.status = status
  }
}