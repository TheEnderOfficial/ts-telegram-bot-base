import { PaymentProvider } from "@prisma/client";
import { Composer, Markup, Scenes } from "telegraf";
import { startHandler } from "../bHandlers/mainHandler";
import userMiddleware from "../bMiddlewares/userMiddleware";
import { Context } from "../bTypes";
import { config, config as paymentConfig } from "../../paymentSystem/pConfig";
import PaymentService from "../../paymentSystem/paymentService";

const CANCEL_BUTTON = "❌ Отмена";
const CANCEL_BUTTON_CALLBACK = "cancel";

const providerSelectComposer = new Composer<Context>();

providerSelectComposer.action(CANCEL_BUTTON_CALLBACK, async (ctx) => {
  await ctx.scene.leave();
  return await startHandler(ctx);
});

paymentConfig.providers.forEach((provider) => {
  providerSelectComposer.action(provider.name, async (ctx) => {
    ctx.session.__topupScene_provider = provider.name;
    ctx.wizard.next();
    await ctx.reply(
      "Введите сумму платежа в Российских Рублях 🇷🇺",
      Markup.removeKeyboard()
    );
  });
});

providerSelectComposer.use(async (ctx) => {
  ctx.session.__topupScene_amount = 0;
  ctx.session.__topupScene_provider = PaymentProvider.QIWI;
  await ctx.reply(
    "Выберите платёжный способ. 💵🟠💳",
    keyboard
  );
});

const amountSelectComposer = new Composer<Context>();

amountSelectComposer.use(userMiddleware);

amountSelectComposer.on("text", async (ctx) => {
  let text = ctx.message.text;
  let number = +text;

  if (isNaN(number)) {
    await ctx.reply("Введите сумму платежа в Российских Рублях 🇷🇺");
  } else {
    ctx.session.__topupScene_amount = number;

    await PaymentService.create(
      ctx.session.__topupScene_amount,
      ctx.user,
      ctx.session.__topupScene_provider
    );

    await ctx.scene.leave();
    return await startHandler(ctx);
  }
});

const keyboard = Markup.inlineKeyboard([
  ...config.providers
    .map((i, j) => Markup.button.callback(i.displayName, i.name))
    .map((i) => [i]),
  [Markup.button.callback(CANCEL_BUTTON, CANCEL_BUTTON_CALLBACK)],
]);

export const topupScene = new Scenes.WizardScene<Context>(
  "topup",
  providerSelectComposer,
  amountSelectComposer
);
