const BaseEvent = require("./BaseEvent");

module.exports = class CustomerRegisteredEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("CustomerRegistered", timestamp, body);
  }
};