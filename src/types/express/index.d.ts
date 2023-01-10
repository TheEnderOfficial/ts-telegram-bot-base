import { WebUser } from "@prisma/client";
import { Bot } from "../../bot/bTypes";

interface Request {
  user: WebUser;
  bot: Bot;
}
export { Request };

declare module 'express-serve-static-core' {
    interface Request {
        user: WebUser;
        bot: Bot;
    }
}