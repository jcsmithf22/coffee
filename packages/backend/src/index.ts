import { createMistral } from "@ai-sdk/mistral";
import { createCohere } from "@ai-sdk/cohere";
import { createCerebras } from "@ai-sdk/cerebras";
import { ollama } from "ollama-ai-provider";
/* import { tools } from "./tools"; */
import { createAnthropic } from "@ai-sdk/anthropic";
import { createFireworks } from "@ai-sdk/fireworks";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { Hono } from "hono";
import {
  InvalidToolArgumentsError,
  NoSuchToolError,
  streamText,
  ToolExecutionError,
  type Message,
} from "ai";
import { stream } from "hono/streaming";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { tools } from "./tools";
// @ts-ignore
import SYSTEM_PROMPT from "./system.txt?raw";
import { cartQuery, orderQuery, subscriptionQuery } from "./queries";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

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
  })("claude-3-5-sonnet-latest"),
  fireworks: createFireworks({
    apiKey: process.env.FIREWORKS_API_KEY,
  })("accounts/fireworks/models/deepseek-v3-0324"),
  // accounts/fireworks/models/llama4-maverick-instruct-basic
  groq: createGroq({
    apiKey: process.env.GROQ_API_KEY,
  })("meta-llama/llama-4-scout-17b-16e-instruct"),
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })("gpt-4o"),
  cerebras: createCerebras({
    apiKey: process.env.CEREBRAS_API_KEY,
  })("llama3.3-70b"),
  openRouter: createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  })("openrouter/quasar-alpha"),
};

// const app = create({
//   model: models.mistral,
//   tools,
// });
//
type Body = {
  messages: Message[];
};

const app = new Hono()
  .use(
    cors({
      origin: "*",
      allowHeaders: ["*"],
      allowMethods: ["GET"],
      credentials: false,
    }),
  )
  .post("/generate", zValidator("json", z.custom<Body>()), async (c) => {
    const { messages } = c.req.valid("json");

    try {
      const result = streamText({
        model: models.openRouter,
        system: SYSTEM_PROMPT,
        messages,
        tools,
        maxSteps: 50,
        temperature: 0,
      });
      c.header("X-Vercel-AI-Data-Stream", "v1");
      c.header("Content-Type", "text/plain; charset=utf-8");

      return stream(c, (stream) =>
        stream.pipe(
          result.toDataStream({
            getErrorMessage(error) {
              console.error("Error here");
              if (NoSuchToolError.isInstance(error)) {
                return "The model tried to call a unknown tool.";
              } else if (InvalidToolArgumentsError.isInstance(error)) {
                return "The model called a tool with invalid arguments.";
              } else if (ToolExecutionError.isInstance(error)) {
                return "An error occurred during tool execution.";
              } else {
                return "An unknown error occurred.";
              }
            },
          }),
        ),
      );
    } catch (error) {
      console.error("Error in /generate");
    }
  })
  .get("/cart", async (c) => {
    const result = await cartQuery();
    return c.json(result);
  })
  .get("/order", async (c) => {
    const result = await orderQuery();
    return c.json(result);
  })
  .get("/subscription", async (c) => {
    const result = await subscriptionQuery();
    return c.json(result);
  });

export default {
  port: 4000,
  fetch: app.fetch,
};

export type App = typeof app;
