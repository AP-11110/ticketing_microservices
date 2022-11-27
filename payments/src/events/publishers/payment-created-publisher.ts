import { Publisher, Subjects, PaymentCreatedEvent } from "@ticketing-ap/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}