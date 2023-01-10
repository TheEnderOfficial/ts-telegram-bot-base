import { Markup, Scenes } from "telegraf";
import { prisma } from "../../db";
import WebUserService from "../../webUsers/webUserService";
import userMiddleware from "../bMiddlewares/userMiddleware";
import { Context } from "../bTypes";

export const linkScene = new Scenes.BaseScene<Context>("linkSettings");

const BACK_BUTTON = "🔙 Назад";
const BACK_BUTTON_CALLBACK = "back";

const UNLIK_BUTTON = "🔗 Отвязать";
const UNLIK_BUTTON_CALLBACK = "unlink";

const LINK_BUTTON = "🔗 Привязать";
const LINK_BUTTON_CALLBACK = "link";

linkScene.use(userMiddleware)

linkScene.enter(async (ctx) => {
    console.log(ctx.user);
    
    let web = await prisma.webUser.findFirst({where: {tgUserId: ctx.user.id}})
    let isConnected = web !== null;

    let text = `
        🌐 Веб-аккаунт ${isConnected ? "привязан" : "не привязан"} к Telegram аккаунту ${isConnected ? `(${web?.username})` : ''}
    `

    await ctx.reply(text, Markup.inlineKeyboard(
        [
            [
                isConnected ? Markup.button.callback(UNLIK_BUTTON, UNLIK_BUTTON_CALLBACK) : Markup.button.callback(LINK_BUTTON, LINK_BUTTON_CALLBACK)
            ],
            [
                Markup.button.callback(BACK_BUTTON, BACK_BUTTON_CALLBACK)
            ]
        ]
    ));
});

linkScene.action(BACK_BUTTON_CALLBACK, async (ctx) => {
    await ctx.scene.leave();
    return await ctx.scene.enter("profile");
});

linkScene.action(UNLIK_BUTTON_CALLBACK, async (ctx) => {
    let web = await prisma.webUser.findFirst({where: {tgUserId: ctx.user.id}})
    let isConnected = web !== null;

    if (!isConnected) return await ctx.reply("Веб-аккаунт не привязан к Telegram аккаунту");

    await WebUserService.unlinkTelegram(ctx.user);

    return await ctx.reply("Аккаунт успешно отвязан.", Markup.inlineKeyboard([Markup.button.callback(BACK_BUTTON, BACK_BUTTON_CALLBACK)]));
});

linkScene.action(LINK_BUTTON_CALLBACK, async (ctx) => {
    await ctx.reply("Для привязки аккаунта вам нужно зарегистрироваться на сайте и в профиле нажать Привязать Telegram")
});