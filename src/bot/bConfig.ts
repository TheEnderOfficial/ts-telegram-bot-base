import {Scenes, MiddlewareFn} from "telegraf"
import mainHandlers, { startHandler } from "./bHandlers/mainHandler";
import paymentHandlers from "./bHandlers/paymentHandler";
import userMiddleware from "./bMiddlewares/userMiddleware";
import { linkScene } from "./bScenes/linkSettingsScenes";
import { profileScene } from "./bScenes/profileScene";
import { topupScene } from "./bScenes/topupScene";
import { Bot, Context } from "./bTypes";

type Handler = (bot: Bot) => void;

const scenes: Scenes.BaseScene<Context>[] = [
    // Add your scenes here
    profileScene,
    topupScene,
    linkScene
];
const globalMiddlewares: MiddlewareFn<Context>[] = [
    // Add your global middlewares here
    userMiddleware
];
const handlers: Handler[] = [
    mainHandlers,
    paymentHandlers,
    (bot) => bot.on("message", startHandler)
];

export {scenes, globalMiddlewares, handlers};