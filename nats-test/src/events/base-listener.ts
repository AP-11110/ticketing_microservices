import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
    subject: Subjects;
    data: any;
}

// whenever Listener is extended, custom type will have to be provided
export abstract class Listener <T extends Event>{
    abstract subject: T["subject"];
    abstract queueGroupName: string;
    abstract onMessage(data: T["data"], msg: Message): void;
    private client: Stan;
    protected ackWait = 5 * 1000; // event without acknowledgment should be resent in 5s


    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable() // redelivers events in case the listener goes down and has to restart
            .setManualAckMode(true) // will manually acknowledge events
            // default behaviour is to automatically acknowledge events
            // this is not good practice in case something goes wrong
            // when the acknowledgment isn't made an event is resent after 30s to a different member of the group
            // even should be acknowledged after it's been processed
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName); // keeps track of events and only redelivers unprocessed events
    }

    listen() {
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroupName, // making sure that if the listener disconnects, nats will not dump durablename subscription and that events only go to 1 listener instance
            this.subscriptionOptions()
        );
        subscription.on("message", (msg: Message) => {
            console.log(
                `Message received ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    }

    parseMessage(msg: Message) {
        const data = msg.getData();
        return typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString("utf-8"));
    }
    // Message has some useful methods such as 
    // getSubject() returns 'ticket:created'
    // getData() returns '{"id":"123","title":"concert","price":20}'
    // getSequence() returns event number, 1 for first event and so on
}