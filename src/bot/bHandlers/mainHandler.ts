import { Telegraf, Markup } from "telegraf";
import { prisma } from "../../db";
import WebUserService from "../../webUsers/webUserService";
import { decrypt } from "../../webUsers/webUsersUtils";
import { Bot, Context } from "../bTypes";

const PROFILE = "📝 Профиль";
let mainMenuMarkup = Markup.keyboard([[PROFILE]])
  .resize()
  .oneTime();

export const startHandler = async(ctx: Context) =>
  {
    let payload = ctx.startPayload;
    if (payload) {
      let data = decrypt(payload, process.env.SECRET || 'secret');
      if (data.startsWith('link_')) {
        let user = await WebUserService.checkMessage(payload);

        if (!user || !ctx.user) {
          return await ctx.reply("Произошла ошибка при привязке аккаунта");
        }

        if (user.tgUserId) {
          return await ctx.reply("К данному веб аккаунту уже привязан другой Telegram, отвяжите его в профиле на сайте.")
        }

        let candidate = await prisma.webUser.findFirst({
          where: {
            tgUser: ctx.user
          }
        });

        if (candidate) {
          return await ctx.reply("К данному Telegram аккаунту уже привязан другой веб аккаунт, отвяжите его в настройках.")
        }

        await WebUserService.link(user, ctx.user);

        return await ctx.reply(`Вы успешно привязали аккаунт ${user?.username ?? "неизвестный"} к аккаунту Telegram`);
      }
    }

    await ctx.reply(
      `Привет, ${ctx.user?.name ?? "гость"}!`,
      mainMenuMarkup
    );
  }

function mainHandlers(bot: Bot) {
  bot.start(startHandler);

  bot.hears(PROFILE, (ctx) => ctx.scene.enter("profile"));
}

export default mainHandlers;
