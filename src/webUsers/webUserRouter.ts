import { Router } from "express";
import roleMiddleware from "../wMiddlewares/wRoleMiddleware";
import userMiddleware from "../wMiddlewares/wUserMiddleware";
import WebUserController from "./webUserController";

const router = Router();

router.post("/register", WebUserController.register);
router.post("/login", WebUserController.login);
router.get("/me", userMiddleware, WebUserController.me);
router.get("/me/linkTelegram", userMiddleware, WebUserController.link)
router.post("/me/unlinkTelegram", userMiddleware, WebUserController.unlink)
router.post("/changePassword", userMiddleware, WebUserController.changePassword);

router.get("/:id", roleMiddleware("ADMIN"), WebUserController.findById);
router.get("/", roleMiddleware("ADMIN"), WebUserController.findAll);

export default router;
