import { openai } from "..";

export class OpenaiService {
  public async ask(question: string) {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "assistant", content: "How can I help you?" },
        { role: "user", content: question }
      ]
    });
    return response.data.choices[0].message?.content as string;
  }
}

export const openaiService = new OpenaiService();