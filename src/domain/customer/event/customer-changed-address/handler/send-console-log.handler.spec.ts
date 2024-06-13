import EventDispatcher from "../../../../@shared/event/event-dispatcher";
import Customer from "../../../entity/customer";
import Address from "../../../value-object/address";
import SendConsoleLogHandler from "./send-console-log.handler.";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

describe("Domain event Customer changed address event handlers", () => {
  it("should execute handle SendConsoleLogHandler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register(CustomerChangedAddressEvent.name, eventHandler);

    expect(
      eventDispatcher.getEventHandlers[CustomerChangedAddressEvent.name][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("123", "John Doe");
    const address = new Address("street 123", 123, "zipCode 123", "City 123");

    customer.changeAddress(address);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent(
      customer
    );

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toBeCalledTimes(1);
  });
});
