export default class CustomError extends Error {
    constructor(message, statusCode = 500) {
        super(message)
        this.stausCode = statusCode
        Error.captureStackTrace(this, this.constructor)
    }
}
