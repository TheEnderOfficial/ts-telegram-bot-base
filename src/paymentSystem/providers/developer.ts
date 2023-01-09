import { Payment, PaymentProvider, PaymentStatus } from "@prisma/client";
import { IPaymentProvider } from "../pTypes";
import { Express } from "express";
import { Bot } from "../../bot/bTypes";

export class DeveloperProvider implements IPaymentProvider {
  name = PaymentProvider.DEVELOPER;
  displayName = "💻 Developer";

  async processCreate(payment: Payment): Promise<Payment> {
    console.log("Devloper payment created", { payment });
    payment.status = PaymentStatus.SUCCESS;
    return payment;
  }
  async check(payment: Payment): Promise<PaymentStatus> {
    return PaymentStatus.SUCCESS;
  }

  setup(app: Express, bot: Bot): void {}
}
