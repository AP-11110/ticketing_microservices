import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const start = async () => {
    if(!process.env.JWT_KEY) {
        throw new Error('JWT must be defined');
    }
    if(!process.env.MONGO_URI) {
        throw new Error("MONGO_URI must be defined");
    }
    if(!process.env.NATS_CLIENT_ID) {
        throw new Error("NATS_CLIENT_ID must be defined");
    }
    if(!process.env.NATS_URL) {
        throw new Error("NATS_URL must be defined");
    }
    if(!process.env.NATS_CLUSTER_ID) {
        throw new Error("NATS_CLUSTER_ID must be defined");
    }
    try{
        // 1st argument is clusterId which is defined under -cid in nats-depl.yaml
        // url is nats service name + port defined in nats-depl.yaml
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL,
        );

        natsWrapper.client.on("close", () => {
            console.log("Nats connection closed!");
            process.exit(); // manually exiting the program
        })
        // below are watching for interrupt or terminate signals (restarting or ctrl+c)
        process.on("SIGINT", () => natsWrapper.client.close());
        process.on("SIGTERM", () => natsWrapper.client.close());

        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error(err);
    }
    app.listen(3000, () => {
        console.log('Listening on port 3000!!!');
    })
}

start();