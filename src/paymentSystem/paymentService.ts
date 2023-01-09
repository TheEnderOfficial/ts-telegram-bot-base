import { Payment, PaymentProvider, PaymentStatus, User } from "@prisma/client";
import { Bot } from "../bot/bTypes";
import { prisma } from "../db";
import UserService from "../users/userService";
import { config } from "./pConfig";

class PaymentService {
  public static bot: Bot;
  public static async findAll(): Promise<Payment[]> {
    return await prisma.payment.findMany();
  }

  public static async find(id: string): Promise<Payment | null> {
    return await prisma.payment.findUnique({
      where: {
        id,
      },
    });
  }

  public static async create(
    amount: number,
    user: User,
    provider_: PaymentProvider
  ) {
    let provider = config.findProvider(provider_);

    let payment = await prisma.payment.create({
      data: {
        amount,
        user: {
          connect: {
            id: user.id,
          },
        },
        provider: provider_,
        status: PaymentStatus.PENDING,
      },
    });

    payment = await provider.processCreate(payment);
    let payment__: any = JSON.parse(JSON.stringify(payment));
    payment__.id = undefined;
    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        ...payment__,
      },
    });
    await this.check(provider_, payment);

    let msg = await provider.formatMessage(payment);

    await this.bot.telegram.sendMessage(
      user.telegramId,
      msg.text,
      msg.keyboard ?? undefined
    );
  }

  public static async check(
    provider_: PaymentProvider,
    payment: Payment
  ): Promise<PaymentStatus> {
    let provider = config.findProvider(provider_);

    payment.status = await provider.check(payment);

    await prisma.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: payment.status,
      },
    });

    if (payment.status === PaymentStatus.SUCCESS) {
      let user = await UserService.findById(payment.userId);

      if (!user) throw new Error("User not found for payment " + payment.id);

      await UserService.chargeBalance(user, payment.amount);
      await this.bot.telegram.sendMessage(
        user.telegramId,
        `Пополнение баланса на ${payment.amount} рублей прошло успешно`
      );

      return PaymentStatus.SUCCESS;
    }
    return payment.status;
  }
}

export default PaymentService;
