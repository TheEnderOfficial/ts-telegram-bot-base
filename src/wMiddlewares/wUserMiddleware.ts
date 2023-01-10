import { Request, Response, NextFunction } from "express";
import WebUserService from "../webUsers/webUserService";

const userMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Отсутствует токен",
    });
  }

  let user = await WebUserService.findUserByJWT(token);

  if (!user) {
    return res.status(401).json({
      error: "Неверный токен",
    });
  }

  req.user = user;
  next();
};

export default userMiddleware;