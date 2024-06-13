import EventDispatcher from "../../../../@shared/event/event-dispatcher";
import Customer from "../../../entity/customer";
import CustomerCreatedEvent from "../customer-created.event";
import SendConsoleLog1Handler from "./send-console-log-1.handler";
import SendConsoleLog2Handler from "./send-console-log-2.handler";

describe("Domain event Customer created event handlers", () => {
  it("should execute handler SendConsoleLog1Handler when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog1Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register(CustomerCreatedEvent.name, eventHandler);

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("123", "John Doe");

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toBeCalledTimes(1);
  });

  it("should execute handler SendConsoleLog2Handler when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog2Handler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register(CustomerCreatedEvent.name, eventHandler);

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0]
    ).toMatchObject(eventHandler);

    const customer = new Customer("321", "Tobey Maguire");

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandler).toBeCalledTimes(1);
  });

  it("should execute all handlers when customer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const sendConsoleLog1Handler = new SendConsoleLog1Handler();
    const sendConsoleLog2Handler = new SendConsoleLog2Handler();
    const spyEventSendConsoleLog1Handler = jest.spyOn(
      sendConsoleLog1Handler,
      "handle"
    );
    const spyEventSendConsoleLog2Handler = jest.spyOn(
      sendConsoleLog2Handler,
      "handle"
    );

    eventDispatcher.register(CustomerCreatedEvent.name, sendConsoleLog1Handler);
    eventDispatcher.register(CustomerCreatedEvent.name, sendConsoleLog2Handler);

    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name]
    ).toHaveLength(2);
    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][0]
    ).toMatchObject(sendConsoleLog1Handler);
    expect(
      eventDispatcher.getEventHandlers[CustomerCreatedEvent.name][1]
    ).toMatchObject(sendConsoleLog2Handler);

    const customer = new Customer("321", "Tobey Maguire");

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventSendConsoleLog1Handler).toBeCalledTimes(1);
    expect(spyEventSendConsoleLog2Handler).toBeCalledTimes(1);
  });
});
