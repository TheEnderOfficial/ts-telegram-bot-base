import "dotenv/config";
import ngrok from "ngrok";
import { createServer } from "http";
import express from "express";
import { Telegraf, Scenes, session } from "telegraf";
import { Context } from "./bot/bTypes";
import { routers, globalMiddlewares } from "./wConfig";
import {
  handlers,
  scenes,
  globalMiddlewares as bGlobalMiddlewares,
} from "./bot/bConfig";
import { prisma } from "./db";
import { config as paymentConfig } from "./paymentSystem/pConfig";
import PaymentService from "./paymentSystem/paymentService";
import cors from "cors";
import botMiddleware from "./wMiddlewares/wBotMiddleware";

async function main() {
  if (!process.env.BOT_TOKEN) {
    throw new Error("BOT_TOKEN must be provided!");
  }

  const BOT_TOKEN = process.env.BOT_TOKEN;
  const PORT = process.env.PORT || 3000;

  const IS_NGROK = process.env.NGROK === "1";
  const NGROK_AUTH_TOKEN = process.env.NGROK_AUTH_TOKEN;
  const NGROK_REGION = process.env.NGROK_REGION || "eu";

  if (IS_NGROK && !NGROK_AUTH_TOKEN) {
    throw new Error("NGROK_AUTH_TOKEN must be provided!");
  }

  if (IS_NGROK && NGROK_AUTH_TOKEN) {
    await ngrok.authtoken(NGROK_AUTH_TOKEN);
  }

  let url = await ngrok.connect({
    addr: PORT,
    region: NGROK_REGION as ngrok.Ngrok.Region,
  });

  const app = express();
  const bot = new Telegraf<Context>(BOT_TOKEN);
  const server = createServer(app);
  const stage = new Scenes.Stage<Context>([...scenes]);

  app.use(express.json());
  app.use(cors());
  app.use(botMiddleware(bot));

  // setup payments here
  PaymentService.bot = bot;

  paymentConfig.providers.map((provider) => provider.setup(app, bot, url));
  // end setup payments

  bot.telegram.setWebhook(`${url}/bot${BOT_TOKEN}`);
  app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));

  globalMiddlewares.map((middleware) => app.use(middleware));
  routers.map((router) => app.use(router.path, router.router));

  bot.use(session());
  bGlobalMiddlewares.map((middleware) => bot.use(middleware));
  bot.use(stage.middleware());

  handlers.map((handler) => handler(bot));

  server.listen(PORT, async () => {
    await prisma.$connect();
    console.log(`Server listening on port ${PORT}`);
    console.log(`Ngrok URL: ${url}`);
  });
}

main();
