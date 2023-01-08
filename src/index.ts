import "dotenv/config";
import ngrok from "ngrok";
import { createServer } from "http";
import express from "express";
import { Telegraf, Scenes, session } from "telegraf";
import { Context } from "./bTypes";
import { routers, globalMiddlewares } from "./wConfig";
import {
  handlers,
  scenes,
  globalMiddlewares as bGlobalMiddlewares,
} from "./bConfig";
import setupQiwi from "./pQiwi"
import { prisma } from "./db";

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

  await setupQiwi(app);

  bot.telegram.setWebhook(`${url}/bot${BOT_TOKEN}`);
  app.use(bot.webhookCallback(`/bot${BOT_TOKEN}`));

  globalMiddlewares.map((middleware) => app.use(middleware));
  routers.map((router) => app.use(router));

  bot.use(session());
  bot.use(stage.middleware());

  bGlobalMiddlewares.map((middleware) => bot.use(middleware));
  handlers.map((handler) => handler(bot));

  server.listen(PORT, async () => {
    await prisma.$connect();
    console.log(`Server listening on port ${PORT}`);
    console.log(`Ngrok URL: ${url}`);
  });
}

main();
