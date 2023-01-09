import { Payment, PaymentProvider, PaymentStatus } from "@prisma/client";
import { IPaymentProvider } from "../pTypes";
import { Express } from "express";
import { Bot } from "../../bot/bTypes";
import { BillStatus, Wallet } from "qiwi-sdk";
import { P2p } from "qiwi-sdk";
import { randomUUID } from "crypto";
import { prisma } from "../../db";
import { Markup } from "telegraf";

export class QIWIProvider implements IPaymentProvider {
  name = PaymentProvider.QIWI;
  displayName = "🟠 QIWI";

  wallet: Wallet | undefined;
  p2p: P2p | undefined;
  bot: Bot | undefined;

  private async getBillConfig() {
    if (!this.p2p || !this.wallet || !this.bot) throw new Error("Not setup");
    let billId = randomUUID().replace(/-/g, "");

    return {
      amount: {
        currency: "RUB",
        value: 0,
      },
      billId: billId,
      comment: "Пополнение баланса",
      successUrl: `https://t.me/${(await this.bot.telegram.getMe()).username}`,
    };
  }

  async processCreate(payment: Payment): Promise<Payment> {
    if (!this.p2p || !this.wallet || !this.bot) throw new Error("Not setup");
    let billConfig = await this.getBillConfig();

    let bill = await this.p2p.bills.create({
      ...billConfig,
      amount: {
        currency: "RUB",
        value: payment.amount,
      },
    });

    payment.qiwiBillId = billConfig.billId;
    payment.qiwiPayUrl = bill.payUrl;

    return payment;
  }

  async formatMessage(payment: Payment) {
    if (!this.p2p || !this.wallet || !this.bot) throw new Error("Not setup");
    if (!payment.qiwiBillId || !payment.qiwiPayUrl) throw new Error("not");
    return {
      text: "Оплата через QIWI",
      keyboard: Markup.inlineKeyboard([
        [Markup.button.url("Оплатить", payment.qiwiPayUrl)],
        [
          Markup.button.callback("Проверить оплату", "payment_check_" + payment.id)
        ]
      ]),
    };
  }

  async getPaymentByBillID(billID: string) {
    if (!this.p2p || !this.wallet || !this.bot) throw new Error("Not setup");

    return await prisma.payment.findFirst({
      where: {
        qiwiBillId: billID,
      },
    });
  }

  async check(payment: Payment): Promise<PaymentStatus> {
    if (!this.p2p || !this.wallet) throw new Error("Not setup");
    if (!payment.qiwiBillId) throw new Error("No bill id");

    let bill = await this.getPaymentByBillID(payment.qiwiBillId);

    if (!bill) throw new Error("No bill");
    if (!bill.qiwiBillId) throw new Error("No bill id");

    let newStatus: PaymentStatus = PaymentStatus.PENDING;
    let qwStatus = await this.p2p.bills.getStatus(bill.qiwiBillId);
    if (qwStatus.status.value === BillStatus.PAID) {
      newStatus = PaymentStatus.SUCCESS;
    } else if (qwStatus.status.value == "WAITING") {
      newStatus = PaymentStatus.PENDING;
    } else {
      newStatus = PaymentStatus.FAILED;
    }

    await prisma.payment.update({
      where: {
        id: bill.id,
      },
      data: {
        status: newStatus,
      },
    });

    return bill.status;
  }

  setup(app: Express, bot: Bot): void {
    if (!process.env.QIWI_TOKEN) throw new Error("No token");
    if (!process.env.QIWI_P2P_SECRET) throw new Error("No secret");
    if (!process.env.QIWI_P2P_PUBLIC) throw new Error("No public");
    this.wallet = Wallet.create(process.env.QIWI_TOKEN);
    this.p2p = P2p.env(
      process.env.QIWI_P2P_SECRET,
      process.env.QIWI_P2P_PUBLIC
    );
    this.bot = bot;
    
    app.post(
      "/webhook/qiwi",
      this.p2p.notificationMiddleware({}, async (req) => {
        let { billId, amount } = req.body;

        let payment = await this.getPaymentByBillID(billId);
        if (!payment) throw new Error("No payment");
        let status = await this.check(payment);
      })
    );
  }
}
