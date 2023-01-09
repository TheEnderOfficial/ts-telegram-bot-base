import { PaymentProvider, User } from "@prisma/client";
import { Telegraf, Context as TContext, Scenes } from "telegraf";

interface Session extends Scenes.WizardSession {
  // Add your own session properties here
  __topupScene_amount: number;
  __topupScene_provider: PaymentProvider;
}

interface Context extends TContext {
  // Add your own context properties here
  user: User;

  scene: Scenes.SceneContextScene<Context, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<Context>;
  session: Session;
}

type Bot = Telegraf<Context>;

export { Bot, Context };
