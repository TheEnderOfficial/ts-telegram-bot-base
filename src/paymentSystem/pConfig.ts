import { PaymentProvider } from "@prisma/client";
import { DeveloperProvider } from "./providers/developer";
import { IPaymentsConfig } from "./pTypes";

export const developerProvider = new DeveloperProvider();

const config: IPaymentsConfig = {
    providers: [developerProvider],
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