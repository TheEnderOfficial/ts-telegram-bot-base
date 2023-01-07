import { Telegraf, Context as TContext, Scenes } from "telegraf";

interface Session extends Scenes.WizardSession {
  // Add your own session properties here
}

interface Context extends TContext {
  // Add your own context properties here
  scene: Scenes.SceneContextScene<Context, Scenes.WizardSessionData>;
  wizard: Scenes.WizardContextWizard<Context>;
  session: Session;
}

type Bot = Telegraf<Context>;

export { Bot, Context };
