import { Middleware, Scenes } from "telegraf";
import { combineParagraphs } from "../utils/format";
import { CANCEL_CHOICE, cancelKeyboard } from "../keyboards/cancelKeyboard";
import { SceneContext } from "telegraf/typings/scenes";
import { mainMenuKeyboard } from "../keyboards/mainMenuKeyboard";

export const helpScene = new Scenes.BaseScene<SceneContext>("HelpScene");

export interface ICommand {
  name: string;
  description: string;
}

export const commands: ICommand[] = [
  {
    name: "ask",
    description: "Ask ChatGPT"
  },
  {
    name: "help",
    description: "Get help"
  },
  {
    name: "start",
    description: "Get greeting"
  }
];

export const notes: string[] = [
  "This bot doesn't save chat history, so each time you ask ChatGPT, please, provide it with context",
  "Each request is queued, so keep in mind that it may sometimes take longer time to respond"
];

helpScene.enter(ctx => {
  const commandRows = commands.map(command => `/${command.name} – ${command.description}`);
  const noteRows = notes.map((note, index) => `${index + 1}. ${note}`);

  const message = combineParagraphs([
    combineParagraphs([
      "🤖 Unofficial ChatGPT bot",
      "🛠️ Model: GPT 3.5 Turbo"
    ]),
    combineParagraphs(commandRows),
    ...noteRows
  ], 1);
  ctx.reply(message, {
    reply_markup: cancelKeyboard.replyMarkup,
    parse_mode: "HTML"
  });
});

const handleCancel: Middleware<SceneContext> = ctx => {
  ctx.reply("✅ Canceled!", {
    reply_markup: mainMenuKeyboard.replyMarkup
  });
  ctx.scene.leave();
};

helpScene.hears(CANCEL_CHOICE, handleCancel);
helpScene.command("cancel", handleCancel);