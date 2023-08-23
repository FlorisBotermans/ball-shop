const BaseEvent = require("./BaseEvent");

module.exports = class CustomerUpdatedEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("CustomerUpdated", timestamp, body);
  }
};