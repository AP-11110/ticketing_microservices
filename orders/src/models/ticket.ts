import mongoose from "mongoose";
import { Order, OrderStatus } from "../models/order";

interface TicketAttrs {
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

ticketSchema.methods.isReserved = async function() {
    // make sure that this ticket is not already reserved
    // run query to look at all orders. Find an order where the ticket is the ticket we just found *and* the orders status is not cancelled
    // if order with the same ticket is found, ticket is reserved
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete
            ]
        }
    });

    // where the existingOrder is null, below will transform into null => true => false
    return !!existingOrder;
} 

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket }