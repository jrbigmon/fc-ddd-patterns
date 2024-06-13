import EventInterface from "../../../@shared/event/event.interface";

export default class CustomerChangedAddressEvent<T> implements EventInterface {
  dataTimeOccurred: Date;
  eventData: T;

  constructor(eventData: T) {
    this.dataTimeOccurred = new Date();
    this.eventData = eventData;
  }
}
