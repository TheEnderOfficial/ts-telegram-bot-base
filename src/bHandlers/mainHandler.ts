import { Bot } from "../bTypes";
import helloService from "../services/helloService";

function mainHandlers(bot: Bot) {
    bot.start((ctx) => {
        ctx.reply(helloService.sayHello(ctx.from.first_name));
    });
}

export default mainHandlers;