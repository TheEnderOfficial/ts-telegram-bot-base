import { Markup, Scenes } from "telegraf";
import { startHandler } from "../bHandlers/mainHandler";
import { Context } from "../bTypes";

export const profileScene = new Scenes.BaseScene<Context>("profile");

const TOPUP_BUTTON = "💳 Пополнить";
const BACK_BUTTON =  "🔙 Назад";

const PROFILE_KEYBOARD = Markup.keyboard(
    [
        TOPUP_BUTTON, BACK_BUTTON
    ]
).resize().oneTime()

profileScene.enter(async (ctx) => {
    await ctx.reply(`🆔 Telegram ID: ${ctx.user.telegramId}
📧 Имя: ${ctx.user.name}
💵 Баланс: ${ctx.user.balance.toLocaleString("ru", {style: "currency", currency: "RUB"})}`, PROFILE_KEYBOARD);
});

profileScene.hears(TOPUP_BUTTON, (ctx) => ctx.scene.enter("topup"));
profileScene.hears(BACK_BUTTON, async (ctx) => {
    await ctx.scene.leave()
    return startHandler(ctx)
});
