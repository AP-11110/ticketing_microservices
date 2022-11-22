import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

declare global {
    function signin(): string[]; // cookie resolves with value (array of strings)
}

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

global.signin = () => {
    // build a JWT payload { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
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