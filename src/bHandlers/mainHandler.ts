import { Telegraf, Markup } from "telegraf";
import { Bot, Context } from "../bTypes";

const PROFILE = "📝 Profile";
let mainMenuMarkup = Markup.keyboard([[PROFILE]])
  .resize()
  .oneTime();

export const startHandler = (ctx: Context) =>
  ctx.reply(
    `<Text for start command (./src/bHandlers/mainHandler.ts)>`,
    mainMenuMarkup
  );

function mainHandlers(bot: Bot) {
  bot.command("start", startHandler);

  bot.hears(PROFILE, (ctx) => ctx.scene.enter("profile"));
}

export default mainHandlers;
