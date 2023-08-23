const BaseEvent = require("./BaseEvent");

module.exports = class OrderRegisteredEvent extends BaseEvent {
  constructor(timestamp, body) {
    super("OrderRegisteredEvent", timestamp, body);
  }
};
