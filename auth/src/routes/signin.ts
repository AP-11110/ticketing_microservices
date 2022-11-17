import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate-request";
import { User } from "../models/user";
import { Password } from "../services/password";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/api/users/signin", [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password").trim().notEmpty().withMessage("You must supply a password")
], validateRequest, async (req: Request, res: Response) => {

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // if user doesn't exist
    if(!user) {
        throw new BadRequestError('Invalid credentials');
    }

    // if password invalid
    if(!await Password.compare(user.password, password)) {
        throw new BadRequestError('Invalid credentials');
    }

    // generate JWT  
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!)

    // store it on session object
    req.session = {
        jwt: userJwt
    };
    
    res.status(201).send(user);
})

export { router as signinRouter}