import { Telegraf, Markup } from "telegraf";
import { Bot, Context } from "../bTypes";

const PROFILE = "📝 Профиль";
let mainMenuMarkup = Markup.keyboard([[PROFILE]])
  .resize()
  .oneTime();

export const startHandler = (ctx: Context) =>
  ctx.reply(
    `Привет, ${ctx.user?.name ?? "гость"}!`,
    mainMenuMarkup
  );

function mainHandlers(bot: Bot) {
  bot.command("start", startHandler);

  bot.hears(PROFILE, (ctx) => ctx.scene.enter("profile"));
}

export default mainHandlers;
