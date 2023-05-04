import { Processor, Queue, Worker } from "bullmq";
import { redisConfig } from "../redis.config";
import { IChatJobData, IChatJobResult } from "../models/chat";
import { openaiService } from "../services/openaiService";

export const handleChatQueue: Processor<IChatJobData, IChatJobResult> = async job => {
  const response = await openaiService.ask(job.data.question);
  return { response, userId: job.data.userId };
}

export const chatQueue = new Queue<IChatJobData, IChatJobResult>("chatQueue", { connection: redisConfig });
export const chatWorker = new Worker<IChatJobData, IChatJobResult>("chatQueue", handleChatQueue, { connection: redisConfig });