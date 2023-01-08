import { Telegraf, Markup } from "telegraf";
import { Bot } from "../bTypes";

const PROFILE = "📝 Profile";
let mainMenuMarkup = Markup.keyboard([
  [PROFILE],
]).resize().oneTime();


function mainHandlers(bot: Bot) {
  bot.command("start", (ctx) => ctx.reply(`<Text for start command (./src/bHandlers/mainHandler.ts)>`, mainMenuMarkup));``

  bot.hears(PROFILE, (ctx) => ctx.scene.enter("profile"));
}

export default mainHandlers;
