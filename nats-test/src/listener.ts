import nats from "node-nats-streaming";
import { v4 as uuidv4 } from 'uuid';
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const client = nats.connect("ticketing", uuidv4(), {
    url: "http://localhost:4222"
});

client.on("connect", () => {
    console.log("Listener connected to NATS");

    // 
    client.on("close", () => {
        console.log("Nats connection closed!");
        process.exit(); // manually exiting the program
    })

    new TicketCreatedListener(client).listen();
});


// below are watching for interrupt or terminate signals (restarting or ctrl+c)
process.on("SIGINT", () => client.close())
process.on("SIGTERM", () => client.close())




