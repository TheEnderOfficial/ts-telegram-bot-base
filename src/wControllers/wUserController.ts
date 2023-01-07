import UserService from "../services/userService";
import { Request, Response } from "express";

class UserController {
    public static async findAll(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ message: err });
        }
    }
}

export default UserController;