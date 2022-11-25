import mongoose from "mongoose";
import { Order, OrderStatus } from "../models/order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
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

// setting version control in order to avoid concurrency issues
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

// below does the same as updateIfCurrentPlugin above
// run when we try to update the record
// ticketSchema.pre("save", function(done) {
//     this.$where = {
//         version: this.get("version") - 1
//     };

//     done();
// });

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    })
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