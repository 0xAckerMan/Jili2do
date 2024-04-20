import { Role, User } from '@prisma/client'
import {Request, Response} from 'express'
import {HashPassword} from "../modules/auth"
import prisma from '../modules/db'

export const GetAllUsers = async (req: Request, res: Response) => {
    try {
        const users: User[] = await prisma.user.findMany({
            where: {role: "USER"}, 
            include:{
                tasks: true
            }
        })

        if(!users || users.length === 0){
            return res.status(404).json({error: "no user found"})
        }

        const UserWithoutPassword = users.map(({password, ...rest})=> rest)

        res.status(200).json({"user": UserWithoutPassword})
    } catch(e){
        console.log("Error fetching all users", e)
        res.status(500).json({"error": "Internal server error"})
    }
}

export const GetSingleUser = async (req: Request, res: Response)=>{
    try{
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(req.params.id,10)
            }
        })

        if (!user){
            return res.status(404).json({error: "No user found"})
        }

        const {password: _, ...rest} = user
        res.status(200).json({"user": rest})
    } catch(e){
        console.log("Error fetching a single user", e)
        res.status(500).json({error: "Internal server error"})
    }

}

export const UpdateUser = async (req: Request, res: Response) => {
    try{
        const {name, email, password, role} = req.body

        const data: {
            name?: string,
            email?: string,
            password?: string,
            role?: Role,
        } = {}

        if(name) data.name = name
        if(email) data.email = email
        if(password) data.password = await HashPassword(password)
        if(role) data.role = role

        const UpdatedUser = await prisma.user.update({
            where: {
                id: parseInt(req.params.id, 10)
            },
            data: data
        })

        return res.status(200).json({user:UpdatedUser})
    } catch (e) {
        console.log("Error updating user data",e)
        return res.status(500).json({error: "Internal server error"})
    }
}

export const DeleteUser = async (req: Request, res: Response)=>{
    try{
        const user = await prisma.user.delete({
            where: {
                id: parseInt(req.params.id,10)
            }
        })

        if (!user){
            return res.status(404).json({error: "could not find the requested user"})
        }

        return res.status(200).json({success: "User deleted successfully"})
    } catch (e){
        console.log("Error deleting a user", e)
        res.status(500).json({error:"Internal server error"})
    }
}
