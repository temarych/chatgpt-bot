import { Middleware, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { SceneContext } from "telegraf/typings/scenes";
import { openaiService } from "../services/openaiService";
import { mainMenuKeyboard } from "../keyboards/mainMenuKeyboard";
import { CANCEL_CHOICE, cancelKeyboard } from "../keyboards/cancelKeyboard";

export const askScene = new Scenes.BaseScene<SceneContext>("AskScene");

askScene.enter((ctx, next) => {
  ctx.reply("✍️ Write your question:", {
    reply_markup: cancelKeyboard.replyMarkup
  });
  return next();
});

const handleCancel: Middleware<SceneContext> = ctx => {
  ctx.reply("✅ Canceled!", {
    reply_markup: mainMenuKeyboard.replyMarkup
  });
  ctx.scene.leave();
};

askScene.hears(CANCEL_CHOICE, handleCancel);
askScene.command("cancel", handleCancel);

askScene.on(message("text"), async ctx => {
  const response = await openaiService.ask(ctx.message.text);
  await ctx.reply("🤖 ChatGPT's response:");
  await ctx.reply(response, {
    reply_markup: mainMenuKeyboard.replyMarkup
  });
  ctx.scene.leave();
});