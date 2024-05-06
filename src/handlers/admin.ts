import { Task } from "@prisma/client"
import {Request, Response} from "express"
import prisma from "../modules/db"

export const getUserTasks = async (req: Request, res: Response) => {
    try{
        const tasks: Task[] = await prisma.task.findMany({
            where: {
                ownerId: parseInt(req.params.id)
            }
        })

        if(!tasks || tasks.length === 0){
            return res.status(404).json({response:"no tasks found"})
        }

        return res.status(200).json({tasks:tasks})
    } catch(e){
        console.log("Error retrieving user tasks", e)
        return res.status(500).json({error: "Internal server error"})
    }
}
