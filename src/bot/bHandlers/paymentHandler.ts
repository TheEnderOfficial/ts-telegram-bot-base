import { PaymentStatus } from "@prisma/client";
import { Telegraf, Markup } from "telegraf";
import { prisma } from "../../db";
import PaymentService from "../../paymentSystem/paymentService";
import { Bot, Context } from "../bTypes";

function paymentHandlers(bot: Bot) {
  bot.action(/^payment_check_(.+)/, async (ctx) => {
    let paymentId = ctx.match[1];

    let payment = await prisma.payment.findUnique({
        where: {
            id: paymentId
        }
    });

    if (!payment) {
        return await ctx.reply("А НЕ ПОЙТИ ЛИ КОГДА ТЕБЕ НАХУЙ.")
    }

    let status = await PaymentService.check(payment.provider, payment);
    let statuses: Record<PaymentStatus, string> = {
        [PaymentStatus.PENDING]: "Ожидает оплаты",
        [PaymentStatus.SUCCESS]: "Оплачен",
        [PaymentStatus.FAILED]: "Ошибка оплаты",
    }

    await ctx.reply("Статус платежа: " + statuses[status]);
  })
}

export default paymentHandlers;
