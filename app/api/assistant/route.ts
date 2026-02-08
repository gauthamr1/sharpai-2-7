import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

export const runtime = 'nodejs';
export const maxDuration = 30; // Gives the bot 30 seconds to think

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: Request) {
  const input: { threadId: string | null; message: string } = await req.json();

  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  const createdMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: input.message,
  });

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      const runStream = openai.beta.threads.runs.stream(threadId, {
        assistant_id: process.env.ASSISTANT_ID ?? '',
      });

      await forwardStream(runStream);
    }
  );
}