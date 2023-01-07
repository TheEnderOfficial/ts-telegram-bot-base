import {Scenes, MiddlewareFn} from "telegraf"
import mainHandlers from "./bHandlers/mainHandler";
import { Bot, Context } from "./bTypes";

type Handler = (bot: Bot) => void;

const scenes: Scenes.BaseScene<Context>[] = [];
const globalMiddlewares: MiddlewareFn<Context>[] = [];
const handlers: Handler[] = [
    mainHandlers
];

export {scenes, globalMiddlewares, handlers};