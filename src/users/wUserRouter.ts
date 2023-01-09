import {Router} from "express";
import UserController from "./wUserController";

const router = Router();

router.get("/", UserController.findAll);

export default router;