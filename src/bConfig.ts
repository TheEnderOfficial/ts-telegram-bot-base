import {Scenes, MiddlewareFn} from "telegraf"
import mainHandlers from "./bHandlers/mainHandler";
import userMiddleware from "./bMiddlewares/bUserMiddleware";
import { profileScene } from "./bScenes/profileScene";
import { Bot, Context } from "./bTypes";

type Handler = (bot: Bot) => void;

const scenes: Scenes.BaseScene<Context>[] = [
    // Add your scenes here
    profileScene
];
const globalMiddlewares: MiddlewareFn<Context>[] = [
    // Add your global middlewares here
    userMiddleware
];
const handlers: Handler[] = [
    mainHandlers
];

export {scenes, globalMiddlewares, handlers};