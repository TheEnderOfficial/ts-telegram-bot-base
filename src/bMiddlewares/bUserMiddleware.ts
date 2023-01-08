import {MiddlewareFn} from "telegraf";
import { Context } from "../bTypes";
import UserService from "../services/userService";

const userMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    let user = ctx.from;
    if (!user) return next();

    ctx.user = await UserService.findOrCreateUser(user);
    await next();
};

export default userMiddleware;