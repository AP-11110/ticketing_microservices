import { Publisher, OrderCancelledEvent, Subjects } from "@ticketing-ap/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject = Subjects.OrderCancelled;
}