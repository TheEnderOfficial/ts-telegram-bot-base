import { Payment, PaymentProvider, PaymentStatus, User } from "@prisma/client";
import { prisma } from "../db";
import UserService from "./userService";

class PaymentService {
    public static findAll() {
        return prisma.payment.findMany();
    }

    public static async getUserPayments(userId: string) {
        let user = await UserService.getUserById(userId);

        if (!user) return null;

        return prisma.payment.findMany({
            where: {
                userId
            }
        })
    }

    public static async findByID(payId: string) {
        return prisma.payment.findFirst({
            where: {
                id: payId
            }
        })
    }

    private static async processCreateDevPayment(user: User, payment: Payment) {
        await UserService.chargeBalance(user, payment.amount);
        await this.setPaymentStatus(payment, PaymentStatus.SUCCESS)

        return payment;
    }

    private static async processCreatePayment(user: User, payment: Payment) {
        switch (payment.provider) {
            case PaymentProvider.DEVELOPER:
                return this.processCreateDevPayment(user, payment);
                break;
        }
    }

    public static async setPaymentStatus(payment: Payment, status: PaymentStatus) {
        return await prisma.payment.update({
            where: {
                id: payment.id
            },
            data: {
                status
            }
        })
    }

    public static async createPayment(
        user: User,
        amount: number,
        provider: PaymentProvider,
    ) { 
        let payment = await prisma.payment.create({
            data: {
                amount,
                userId: user.id,
                provider,
                status: PaymentStatus.PENDING
            }
        })
        
        await this.processCreatePayment(user, payment);

        return payment;
    }
}

export default PaymentService;