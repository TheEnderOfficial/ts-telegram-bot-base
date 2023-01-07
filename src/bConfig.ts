import {Scenes, MiddlewareFn} from "telegraf"
import mainHandlers from "./bHandlers/mainHandler";
import { Bot, Context } from "./bTypes";

type Handler = (bot: Bot) => void;

const scenes: Scenes.BaseScene<Context>[] = [
    // Add your scenes here
];
const globalMiddlewares: MiddlewareFn<Context>[] = [
    // Add your global middlewares here
];
const handlers: Handler[] = [
    mainHandlers
];

export {scenes, globalMiddlewares, handlers};