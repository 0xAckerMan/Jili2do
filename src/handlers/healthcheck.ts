import {Request, Response} from 'express'
export const Healthcheck = (req: Request, res: Response) => {
    const status = {
        "status": "active",
        "environment": "dev",
        "version": "1.0.0"
    }

    res.json({"healthcheck": status})
}
