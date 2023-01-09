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

    
  }
}

export default PaymentService;
