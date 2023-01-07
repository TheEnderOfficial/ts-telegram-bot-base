import { Bot } from "../bTypes";

function mainHandlers(bot: Bot) {
   bot.start(async (ctx) => {
       await ctx.reply(`Привет, ${ctx.user.name}!`); 
   })
}

export default mainHandlers;