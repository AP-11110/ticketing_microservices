import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

const start = async () => {
    console.log("Starting");
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
        process.on("SIGINT", () => natsWrapper.client.close())
        process.on("SIGTERM", () => natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen();
    } catch (err) {
        console.error(err);
    }
};

start();