import { create } from "opencontrol";
import { createMistral } from "@ai-sdk/mistral";
import { createCohere } from "@ai-sdk/cohere";
import { ollama } from "ollama-ai-provider";
/* import { tools } from "./tools"; */
import { createAnthropic } from "@ai-sdk/anthropic";
import { createFireworks } from "@ai-sdk/fireworks";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { Hono } from "hono";
import { streamText, type Message } from "ai";
import { stream } from "hono/streaming";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import { tools } from "./tools_new";
// @ts-ignore
import SYSTEM_PROMPT from "./system.txt?raw";

const models = {
  cohere: createCohere({
    apiKey: process.env.COHERE_API_KEY || process.env.CO_API_KEY,
  })("command-a-03-2025"),
  mistral: createMistral({
    apiKey: process.env.MISTRAL_API_KEY,
  })("mistral-small-latest"),
  ollama: ollama("justinledwards/mistral-small-3.1-Q6_K"),
  anthropic: createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  })("claude-3-7-sonnet-latest"),
  fireworks: createFireworks({
    apiKey: process.env.FIREWORKS_API_KEY,
  })("accounts/fireworks/models/deepseek-v3"),
  groq: createGroq({
    apiKey: process.env.GROQ_API_KEY,
  })("llama-3.3-70b-specdec"),
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })("gpt-4o"),
};

// const app = create({
//   model: models.mistral,
//   tools,
// });

const app = new Hono();

app.use(
  cors({
    origin: "*",
    allowHeaders: ["*"],
    allowMethods: ["GET"],
    credentials: false,
  }),
)

type Body = {
  messages: Message[];
}

app.post('/generate', zValidator("json", z.custom<Body>()), async c => {
  const { messages } = await c.req.valid("json");
  const result = streamText({
    model: models.mistral,
    system: SYSTEM_PROMPT,
    messages,
    tools,
    maxSteps: 50,
    temperature: 1
  });

  // Mark the response as a v1 data stream:
  c.header('X-Vercel-AI-Data-Stream', 'v1');
  c.header('Content-Type', 'text/plain; charset=utf-8');

  return stream(c, stream => stream.pipe(result.toDataStream()));
})

export default {
  port: 4000,
  fetch: app.fetch,
};
