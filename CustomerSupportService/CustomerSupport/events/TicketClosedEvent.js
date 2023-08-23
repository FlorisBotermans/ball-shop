const BaseEvent = require("./BaseEvent");

module.exports = class TicketClosedEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("TicketClosedEvent", timestamp, body);
  }
};