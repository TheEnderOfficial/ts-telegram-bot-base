import { Payment, PaymentProvider, PaymentStatus, User } from "@prisma/client";
import { prisma } from "../db";
import UserService from "../users/userService";
import { config } from "./pConfig";

class PaymentService {
  public static async findAll(): Promise<Payment[]> {
    return await prisma.payment.findMany();
  }

  public static async find(id: string): Promise<Payment | null> {
    return await prisma.payment.findUnique({
        where: {
            id
        }
    });
  }

  public static async create(amount: number, user: User, provider_: PaymentProvider) {
    let provider = config.findProvider(provider_);

    let payment = await prisma.payment.create({
      data: {
        amount,
        user: {
          connect: {
            id: user.id
          }
        },
        provider: provider_,
        status: PaymentStatus.PENDING
      }
    });

    payment = await provider.processCreate(payment);
    await this.check(provider_, payment);

    console.log(payment)
  }

  public static async check(provider_: PaymentProvider, payment: Payment): Promise<PaymentStatus> {
    let provider = config.findProvider(provider_);

    payment.status = await provider.check(payment);

    await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: payment.status
      }
    });

    if (payment.status === PaymentStatus.SUCCESS) {
      let user = await UserService.findById(payment.userId);

      if (!user) throw new Error("User not found for payment " + payment.id);

      await UserService.chargeBalance(user, payment.amount);

      return PaymentStatus.SUCCESS;
    }
    return payment.status;
  }
}

export default PaymentService;
