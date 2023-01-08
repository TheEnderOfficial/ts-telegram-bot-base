import { Scenes } from "telegraf";
import { Context } from "../bTypes";

export const profileScene = new Scenes.BaseScene<Context>("profile");

profileScene.enter(async (ctx) => {
    await ctx.reply(`<Text for profile scene (./src/bScenes/profileScene.ts)>\n${JSON.stringify(ctx.user)}`);
});
