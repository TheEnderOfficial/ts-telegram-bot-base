import { PaymentProvider } from "@prisma/client";

const PAYMENT_PROVIDERS = [
    PaymentProvider.QIWI,
    PaymentProvider.DEVELOPER
];

const PAYMENT_PROVIDERS_STR = [
    "🟠 Qiwi",
    "💻 Developer"
]

export {
    PAYMENT_PROVIDERS,
    PAYMENT_PROVIDERS_STR
}