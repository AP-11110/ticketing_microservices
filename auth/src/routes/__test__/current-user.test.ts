import request from "supertest";
import { app } from "../../app";

it("Responds with details about the current user", async () => {
    const cookie = await global.signin(); // declared in the global scope @ setup

    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual("test@test.com");
})

it("responds with null if not authenticated", async () => {
    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200);

    expect(response.body.currentUser).toEqual(null);
})