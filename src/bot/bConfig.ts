import {Scenes, MiddlewareFn} from "telegraf"
import mainHandlers from "./bHandlers/mainHandler";
import userMiddleware from "./bMiddlewares/userMiddleware";
import { profileScene } from "./bScenes/profileScene";
import { topupScene } from "./bScenes/topupScene";
import { Bot, Context } from "./bTypes";

type Handler = (bot: Bot) => void;

const scenes: Scenes.BaseScene<Context>[] = [
    // Add your scenes here
    profileScene,
    topupScene
];
const globalMiddlewares: MiddlewareFn<Context>[] = [
    // Add your global middlewares here
    userMiddleware
];
const handlers: Handler[] = [
    mainHandlers
];

export {scenes, globalMiddlewares, handlers};