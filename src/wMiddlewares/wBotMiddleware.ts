import { Request, Response, NextFunction } from "express";
import { Bot } from "../bot/bTypes";
import WebUserService from "../webUsers/webUserService";

const botMiddleware = (bot: Bot) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
req.bot = bot;
next();
};

export default botMiddleware;