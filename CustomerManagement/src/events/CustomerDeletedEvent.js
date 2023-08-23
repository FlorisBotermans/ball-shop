const BaseEvent = require("./BaseEvent");

module.exports = class CustomerDeletedEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("CustomerDeleted", timestamp, body);
  }
};