import {Request, Response} from 'express'
import prisma from '../modules/db'
import { Task, User } from '@prisma/client'

export const createTask = async (req: Request, res: Response) => {
    try{
        const {title} = req.body

        if (!title){
            return res.status(400).json("Missing required field")
        }

        const Task = await prisma.task.create({
            data: {
                title: title,
                ownerId: req.user.id
            }
        })

        if (!Task){
            return res.status(400).json({error: "could not create taks"})
        }

        return res.status(201).json({task:Task})
    } catch(e){
        console.log("Error creating task", e)
        return res.status(500).json({error:"internal server error"})
    }
}
export const GetMyTasks = async (req: Request, res: Response) => {
    try{
        const user = req.user as User

        const tasks: Task[] = await prisma.task.findMany({
            where: {
                ownerId: user.id
            }
        })

        if (!tasks || tasks.length === 0){
            return res.status(404).json({error: "No tasks found"})
        }

        return res.status(200).json({"tasks": tasks})
    } catch(e){
        console.log("Error fetching tasks", e)
        return res.status(500).json({error: "internal server error"})
    }
}
export const GetTask = async (req: Request, res: Response) => {
    try{
        const user: User = req.user as User

        const task = await prisma.task.findUnique({
            where: {
                id: parseInt(req.params.id),
                ownerId: user.id
            }
        })

        if (!task){
            return res.status(404).json({error:"no task was found"})
        }

        return res.status(200).json({"task": task})
    } catch(e){
        console.log("Error retrieving task",e)
        return res.status(500).json({error: "The server experienced an error"})
    }
}

export const updateTask = async (req: Request, res: Response) => {
    try{
        const user: User = req.user as User

        const {title, completed} = req.body

        const data: {
            title?: string,
            completed?: boolean
        } = {}

        if(title) data.title = title
        if(completed) data.completed = completed

        const task: Task = await prisma.task.update({
            where: {
                id: parseInt(req.params.id, 10),
                ownerId: user.id
            },
            data
        })

        if (!task){
            return res.status(404).json({"error":"cant not update this task"})
        }

        return res.status(200).json({"task":task})
    } catch(err){
        console.log("Error updating a task",err)
        return res.status(500).json({"error": "Server experienced error updating task"})
    }
}
export const DeleteTask = async (req: Request, res: Response) => {
    try{
        const user: User = req.user as User

        const task: Task = await prisma.task.delete({
            where: {
                id: parseInt(req.params.id,10),
                ownerId: user.id
            }
        })

        if (!task){
            return res.status(404).json({error: "No task was found"})
        }

        res.status(200).json({response: "task deleted successfully"})
    } catch (e){
        console.log("Error deleting task", e)
        return res.status(500).json({"error": "The server is experiencing an error"})
    }
}
