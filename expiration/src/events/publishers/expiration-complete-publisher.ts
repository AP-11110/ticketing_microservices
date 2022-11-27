import { Subjects, Publisher, ExpirationCompleteEvent } from "@ticketing-ap/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}