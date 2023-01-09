import { PaymentProvider } from "@prisma/client";
import { DeveloperProvider } from "./providers/developer";
import { QIWIProvider } from "./providers/qiwi";
import { IPaymentsConfig } from "./pTypes";

export const developerProvider = new DeveloperProvider();
export const qiwiProvider = new QIWIProvider();

const config: IPaymentsConfig = {
    providers: [developerProvider, qiwiProvider],
    findProvider(name: PaymentProvider) {
        let provider = this.providers.find((p) => p.name === name);
        if (!provider) {
            throw new Error(`Provider ${name} not found`)
        }
        return provider;
    }
}

export {
    config
}