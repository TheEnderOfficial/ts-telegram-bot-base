import { Request, Response, NextFunction } from "express";
import {UserRole} from "@prisma/client";

const roleMiddleware = (role: UserRole) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    console.log("Ошибка в wRoleMiddleware.ts: req.user не существует")
    return res.status(500).json({
      error: "Ошибка сервера посмотрите в консоль",
    });
  }

    if (req.user.role !== role) {
        return res.status(403).json({
            error: "Доступ запрещен"
        })
    }  

    next(); 
};


export default roleMiddleware;