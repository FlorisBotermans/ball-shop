module.exports = class Error {
  constructor(message, status) {
    this.message = message
    this.code = status
  }
}