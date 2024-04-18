import { Router } from "express";
import {Healthcheck} from './handlers/healthcheck'

const router = Router()

router.route("/api/v1")
router.get("/healthcheck", Healthcheck)

export {router}
