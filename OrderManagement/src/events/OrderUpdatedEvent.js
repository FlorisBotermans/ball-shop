const BaseEvent = require("./BaseEvent");

module.exports = class OrderRegisteredEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("OrderStatusUpdatedEvent", timestamp, body);
  }
};