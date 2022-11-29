import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@ticketing-ap/common";

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        // secure: process.env.NODE_ENV !== "test" // only http
        secure: false,
    })
)

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// next must be used when dealing with promises
// this can be avoided by using - import "express-async-errors";
app.all('*', async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };