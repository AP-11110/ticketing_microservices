import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing-ap/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
}

