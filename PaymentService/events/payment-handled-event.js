const BaseEvent = require("./base-event");

module.exports = class PaymentHandledEvent extends BaseEvent {
  constructor(timestamp, body) {
    super('PaymentHandled', timestamp, body);
  }
}