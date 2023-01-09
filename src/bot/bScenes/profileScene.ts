import { Markup, Scenes } from "telegraf";
import { startHandler } from "../bHandlers/mainHandler";
import { Context } from "../bTypes";

export const profileScene = new Scenes.BaseScene<Context>("profile");

const TOPUP_BUTTON = "💳 Topup";
const BACK_BUTTON =  "🔙 Back";

const PROFILE_KEYBOARD = Markup.keyboard(
    [
        TOPUP_BUTTON, BACK_BUTTON
    ]
).resize().oneTime()

profileScene.enter(async (ctx) => {
    await ctx.reply(`<Text for profile scene (./src/bScenes/profileScene.ts)>\n${JSON.stringify(ctx.user)}`, PROFILE_KEYBOARD);
});

profileScene.hears(TOPUP_BUTTON, (ctx) => ctx.scene.enter("topup"));
profileScene.hears(BACK_BUTTON, async (ctx) => {
    await ctx.scene.leave()
    return startHandler(ctx)
});
