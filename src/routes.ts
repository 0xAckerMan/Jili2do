import { Router } from "express";
import {Healthcheck} from './handlers/healthcheck'
import { Protect } from "./modules/auth";
import { Signin, signUp } from "./handlers/user_auth";
import{GetAllUsers} from "./handlers/user"
import { DeleteTask, GetMyTasks, GetTask, createTask, updateTask } from "./handlers/task";

const router = Router()

router.route("/api/v1")
router.get("/healthcheck", Healthcheck)
router.post("/signup", signUp)
router.post("/signin", Signin)

const r = Router()
r.use(Protect)
//admin routes
r.get("/users", GetAllUsers)

//User routes
r.post("/tasks", createTask)
r.get("/tasks/me", GetMyTasks)
r.get("/tasks/:id", GetTask)
r.patch("/tasks/:id", updateTask)
r.delete("/tasks/:id", DeleteTask)


router.use(r)

export {router}
