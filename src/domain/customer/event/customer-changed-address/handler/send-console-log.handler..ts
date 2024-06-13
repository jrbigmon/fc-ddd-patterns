import EventHandlerInterface from "../../../../@shared/event/event-handler.interface";
import Customer from "../../../entity/customer";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogHandler
  implements EventHandlerInterface<CustomerChangedAddressEvent<Customer>>
{
  handle(event: CustomerChangedAddressEvent<Customer>): void {
    console.log(
      `Endereço do cliente: ${event.eventData.id}, ${event.eventData.name} alterado para: ${event.eventData.Address}`
    );
  }
}
