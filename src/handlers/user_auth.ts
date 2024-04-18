import {Request, Response} from 'express'
import prisma from '../modules/db'
import {ComparePassword, HashPassword} from '../modules/auth'
import {CreateJwt} from "../modules/auth"
import { User } from '@prisma/client'

export const signUp = async (req: Request, res: Response)=>{
    try {
        const {name, email, password, role} = req.body
        if (!name || !email || !password){
            return res.status(400).json({"error": "Missing field required"})
        }

        const hash = await HashPassword(password)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                role
            }
        })

        const {password: _, ...userNopassword} = user
        res.status(201).json({'user':userNopassword})
    } catch(error){
        console.error("Error creating user:", error)
        res.status(500).json({"error": "Internal server error"})
    }
}


export const Signin = async (req: Request, res: Response)=>{
    try{
        const {email, password} = req.body
        if (!email || !password){
            return res.status(400).json({"error": "Missing field required"})
        }

       const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user){
            res.status(401).json({error: "Invalid credentials"})
            return
        }

        const isPasswordValid = await ComparePassword(password, user?.password || '')
        if (!isPasswordValid){
            res.status(401).json({error: "invalid credentials"})
        }

        const token = CreateJwt(user)

        res.status(200).json({"token": token})
    } catch(e){
        console.log("error signing in user", e)
        res.status(500).json("internal server error")
    }
}
