declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

import { User } from "@prisma/client";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt"

export const CreateJwt = (user: User): string =>{
    const token = jwt.sign(
        {"id": user.id, "email": user.email},
        process.env.JWT_SECRET as string,
        {
            algorithm: "HS256",
            expiresIn: "15d",
        })
    return token
}

export const Protect = (req: Request, res: Response, next: Function) => {
    const bearer = req.headers.authorization;

    if(!bearer){
        res.status(401);
        res.send("Not Authorized")
        return
    }

    const [, token] = bearer.split(' ')
    if (!token){
        res.status(401)
        res.send("Not Authorized")
        return
    }

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = payload
        next()
    } catch (e){
        console.log("JWT verification failed: ",e)
        res.status(401)
        res.send("Authentication failed")
        return
    }
}

export const HashPassword = (password: string) => {
    return bcrypt.hash(password,12)
}

export const ComparePassword = (password: string, hash: string) => {
    return bcrypt.compare(password, hash)
}
