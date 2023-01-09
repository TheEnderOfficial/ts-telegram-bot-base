import { Payment, PaymentProvider, PaymentStatus } from "@prisma/client";
import {Express} from "express"
import { Bot } from "../bot/bTypes";

export type Message = {
    text: string;
    keyboard: any; // Markup from telegraf
}
export interface IPaymentProvider {
    name: PaymentProvider;
    displayName: string;

    processCreate(payment: Payment): Promise<Payment>;
    check(payment: Payment): Promise<PaymentStatus>;
    setup(app: Express, bot: Bot): Promise<void> | void;
    formatMessage(payment: Payment): Message | Promise<Message>;
}

export interface IPaymentsConfig {
    providers: IPaymentProvider[];
    findProvider(name: PaymentProvider): IPaymentProvider;
}