import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@ticketing-ap/common";
import { deleteOrderRouter } from "./routes/delete";
import { showOrderRouter } from "./routes/show";
import { newOrderRouter } from "./routes/new";
import { indexOrderRouter } from "./routes";

const app = express();

app.set('trust proxy', true);

app.use(express.json());

app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== "test" // only http
    })
)

app.use(currentUser);
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter);
app.use(indexOrderRouter);

// next must be used when dealing with promises
// this can be avoided by using - import "express-async-errors";
app.all('*', async (req, res) => {
    throw new NotFoundError();
})

app.use(errorHandler);

export { app };