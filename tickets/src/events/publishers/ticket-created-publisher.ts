import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing-ap/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}

