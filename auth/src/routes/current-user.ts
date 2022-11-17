import express from "express";
import { currentUser } from "../middlewares/current-user";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
    res.send({ currentUser: req.currentUser || null }); // null if currentUser is not defined
})

export { router as currentUserRouter}