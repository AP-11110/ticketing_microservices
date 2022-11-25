import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@ticketing-ap/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        // making sure the updates are made in consecutive order
        // if the current ticket version is 1, then the prev ticket entry in the orders/ticket db should have v 0
        // if there's a version difference of more than 1, then the event is out of order and will have to be resent 
        const ticket = await Ticket.findByEvent(data);

        if(!ticket) {
            throw new Error("Ticket not found");
        }

        // add 'version' below in order to use the app without 'mongoose-update-if-current' 
        const { title, price } = data;
        ticket.set({ title, price })
        await ticket.save();

        msg.ack();
    }
}