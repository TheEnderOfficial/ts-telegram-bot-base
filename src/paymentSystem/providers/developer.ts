import { Payment, PaymentProvider, PaymentStatus } from "@prisma/client";
import { IPaymentProvider, Message } from "../pTypes";
import { Express } from "express";
import { Bot } from "../../bot/bTypes";

export class DeveloperProvider implements IPaymentProvider {
  name = PaymentProvider.DEVELOPER;
  displayName = "💻 Режим разработчика";

  async processCreate(payment: Payment): Promise<Payment> {
    payment.status = PaymentStatus.SUCCESS;
    return payment;
  }
  async check(payment: Payment): Promise<PaymentStatus> {
    return PaymentStatus.SUCCESS;
  }
  async formatMessage(payment: Payment){
    return {
      text: "Оплата через режим разработчика",
      keyboard: null
    }
  }

  setup(app: Express, bot: Bot, ngrokAddr: string): void {}
}
