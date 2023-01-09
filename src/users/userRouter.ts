import {Router} from "express";
import UserController from "./userController";

const router = Router();

router.get("/", UserController.findAll);

export default router;