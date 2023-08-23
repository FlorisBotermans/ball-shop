const BaseEvent = require("./BaseEvent");

module.exports = class TicketCreatedEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("TicketCreatedEvent", timestamp, body);
  }
};