import { PaymentProvider } from "@prisma/client";
import { Composer, Markup, Scenes } from "telegraf";
import { startHandler } from "../bHandlers/mainHandler";
import userMiddleware from "../bMiddlewares/bUserMiddleware";
import { Context } from "../bTypes";
import { PAYMENT_PROVIDERS, PAYMENT_PROVIDERS_STR } from "../pConfig";
import PaymentService from "../services/paymentService";

const CANCEL_BUTTON = "❌ Cancel";
const CANCEL_BUTTON_CALLBACK = "cancel";

const providerSelectComposer = new Composer<Context>();

providerSelectComposer.action(CANCEL_BUTTON_CALLBACK, async (ctx) => {
  await ctx.scene.leave();
  return await startHandler(ctx);
});

PAYMENT_PROVIDERS.forEach((provider) => {
  providerSelectComposer.action(provider, async (ctx) => {
    ctx.session.__topupScene_provider = provider;
    ctx.wizard.next();
    await ctx.reply("<Enter payment amount text, ./src/bScenes/topupScene.ts>", Markup.removeKeyboard());

  });
});

providerSelectComposer.use(async (ctx) => {
  ctx.session.__topupScene_amount = 0;
  ctx.session.__topupScene_provider = PaymentProvider.QIWI;
  await ctx.reply(
    "<Select payment provider text, ./src/bScenes/topupScene.ts>",
    keyboard
  );
});

const amountSelectComposer = new Composer<Context>();

amountSelectComposer.use(userMiddleware)

amountSelectComposer.on("text", async ctx => {
    let text = ctx.message.text;
    let number = +text;

    if (isNaN(number)) {
        await ctx.reply("<Amount is not number text, ./src/bScenes/topupScene.ts>");
    }
    else {
        ctx.session.__topupScene_amount = number;
        console.log(ctx.user)

        await PaymentService.createPayment(ctx.user, ctx.session.__topupScene_amount, ctx.session.__topupScene_provider);
        
    }
})

const keyboard = Markup.inlineKeyboard([
  ...PAYMENT_PROVIDERS.map((i, j) =>
    Markup.button.callback(PAYMENT_PROVIDERS_STR[j], i)
  ).map((i) => [i]),
  [Markup.button.callback(CANCEL_BUTTON, CANCEL_BUTTON_CALLBACK)],
]);

export const topupScene = new Scenes.WizardScene<Context>(
  "topup",
  providerSelectComposer,
  amountSelectComposer
);
