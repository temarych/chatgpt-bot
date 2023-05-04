import { Context, Middleware, Scenes, Telegraf, session } from "telegraf";
import dotenv from "dotenv";
import { SceneContext } from "telegraf/typings/scenes";
import { Configuration, OpenAIApi } from "openai";
import { Redis } from "@telegraf/session/redis";
import { askScene } from "./scenes/askScene";
import { combineParagraphs } from "./utils/format";
import { ASK_CHOICE, HELP_CHOICE, mainMenuKeyboard } from "./keyboards/mainMenuKeyboard";
import { commands, helpScene } from "./scenes/helpScene";
import { redisStoreConfig } from "./redis.config";

dotenv.config();

export type BotContext = Context & SceneContext;

export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

export const bot = new Telegraf<BotContext>(BOT_TOKEN);
export const stage = new Scenes.Stage([askScene, helpScene] as any[]);

export const openaiConfig = new Configuration({
  apiKey: OPENAI_API_KEY
});

export const openai = new OpenAIApi(openaiConfig);
export const store = Redis<any>({ config: redisStoreConfig });

bot.use(session({ store }));
bot.use(stage.middleware() as Middleware<Context>);

export const greeting = combineParagraphs([
  "🤖 Unofficial ChatGPT bot",
  "🛠️ Model: GPT 3.5 Turbo",
  "🛟 For help, write /help"
]);

bot.telegram.setMyCommands(commands.map(command => ({
  command: command.name,
  description: command.description
})));

bot.start(ctx => {
  ctx.reply(greeting, {
    reply_markup: mainMenuKeyboard.replyMarkup
  });
});

const handleAsk: Middleware<BotContext> = ctx => {
  ctx.scene.enter("AskScene");
};

const handleHelp: Middleware<BotContext> = ctx => {
  ctx.scene.enter("HelpScene");
};

bot.hears(ASK_CHOICE, handleAsk);
bot.command("ask", handleAsk);

bot.hears(HELP_CHOICE, handleHelp);
bot.command("help", handleHelp);

bot.launch();