import { Router } from "express";
import HelloController from "../wControllers/helloController";

const helloRouter = Router();

helloRouter.get("/", HelloController.hello)

export default helloRouter;