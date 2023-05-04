import { Middleware, Scenes } from "telegraf";
import { message } from "telegraf/filters";
import { SceneContext } from "telegraf/typings/scenes";
import { Job } from "bullmq";
import { mainMenuKeyboard } from "../keyboards/mainMenuKeyboard";
import { CANCEL_CHOICE, cancelKeyboard } from "../keyboards/cancelKeyboard";
import { chatQueue, chatWorker } from "../queues/chatQueue";
import { IChatJobData, IChatJobResult } from "../models/chat";
import { combineParagraphs } from "../utils/format";

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

// inefficient: should reconsider in future updates
const waitForJobResult = (jobId: string) => new Promise<IChatJobResult>(resolve => {
  const listener = (job: Job<IChatJobData>, result: IChatJobResult) => {
    if (job.id !== jobId) return;
    resolve(result);
    chatWorker.removeListener("completed", listener);
  };
  chatWorker.on("completed", listener);
});

const getJobResult = async (jobId: string) => {
  const job = await Job.fromId<IChatJobData, IChatJobResult>(chatQueue, jobId);
  if (!job) throw new Error("Job not found");
  const isCompleted = await job.isCompleted();
  if (isCompleted) return job.returnvalue;
  return await waitForJobResult(jobId);
};

const getQueuePosition = async (jobId: string) => {
  const waitingJobs = await chatQueue.getJobs();
  return waitingJobs.findIndex(job => job.id === jobId);
};

const getWaitMessage = (queuePosition: number) => {
  return combineParagraphs([
    "⏳ Please, wait for ChatGPT's response",
    `⏰ Your position in queue: ${queuePosition + 1}`
  ]);
};

const getResponseMessage = (response: string) => {
  return combineParagraphs([
    "🤖 ChatGPT's response:", 
    response
  ], 1);
};

askScene.on(message("text"), async ctx => {
  const job = await chatQueue.add("chatJob", {
    question: ctx.message.text,
    userId: ctx.from.id
  });

  const queuePosition = await getQueuePosition(job.id as string);
  const waitMessage = getWaitMessage(queuePosition);
  const waitMessageInfo = await ctx.reply(waitMessage);
  
  const jobResult = await getJobResult(job.id as string);
  const responseMessage = getResponseMessage(jobResult.response);

  await ctx.deleteMessage(waitMessageInfo.message_id);
  await ctx.reply(responseMessage, { reply_markup: mainMenuKeyboard.replyMarkup });

  ctx.scene.leave();
});