import {MiddlewareFn} from "telegraf";
import { Context } from "../bTypes";
import UserService from "../../users/userService";

const userMiddleware: MiddlewareFn<Context> = async (ctx, next) => {
    let user = ctx.from;
    if (!user) return next();

    ctx.user = await UserService.findOrCreate(user);
    await next();
};

export default userMiddleware;