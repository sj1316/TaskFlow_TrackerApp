import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error('Missing OPENROUTER_API_KEY environment variable');
}

export const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Task Tracker AI",
  },
});

export async function generateTaskSuggestions(userTasks: any[], userBehavior: string) {
  try {
    const completion = await openRouter.chat.completions.create({
      model: "google/gemma-3-27b-it:free",
      messages: [
        {
          role: "system",
          content: "You are an intelligent task management assistant that helps users organize and optimize their tasks based on their behavior and existing tasks."
        },
        {
          role: "user",
          content: `Based on the following user tasks and behavior, suggest 3 new tasks or improvements that would help the user be more productive:
          
          Current Tasks:
          ${JSON.stringify(userTasks, null, 2)}
          
          User Behavior:
          ${userBehavior}
          `
        }
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    throw error;
  }
}