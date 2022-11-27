import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
    function signin(id?: string): string[]; // cookie resolves with value (array of strings)
}

// fake implementation of nats-wrapper so that jest doesn't depend on the real one
jest.mock("../nats-wrapper");

process.env.STRIPE_KEY = "sk_test_51LwAy4A4YePHF5RM3L49HxGJpq8ZL4SSBkHYW2WMRfs7QfTLDnqeV2F6GFvy9WqYnzOEUuZ298jeBZgQOGbFmfze00LgLHyaXt";

// hook function, this will run before all the tests
let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = "asdf";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";


    const mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async () => {
    if(mongo) {
        await mongo.stop();
    }
    
    await mongoose.connection.close();
});

global.signin = (id?: string) => {
    // build a JWT payload { id, email }
    const payload = {
        id: id || new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    };

    // create the jwt
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // build session object { jwt: my_jwt }
    const session = { jwt: token };

    // turn session into json
    const sessionJSON = JSON.stringify(session);

    // encode json as base64
    const base64 = Buffer.from(sessionJSON).toString("base64")

    // return a string (cookie) with the encoded data
    return [`session=${base64}`];
};