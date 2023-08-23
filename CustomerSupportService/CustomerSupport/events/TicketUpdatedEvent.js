const BaseEvent = require("./BaseEvent");

module.exports = class TicketUpdatedEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("TicketUpdatedEvent", timestamp, body);
  }
};