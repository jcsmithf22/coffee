import { create } from "opencontrol";
import { createMistral } from "@ai-sdk/mistral";
import { createCohere } from "@ai-sdk/cohere";
import { ollama } from "ollama-ai-provider";
import { tools } from "./tools";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createFireworks } from "@ai-sdk/fireworks";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";

const models = {
  cohere: createCohere({
    apiKey: process.env.COHERE_API_KEY,
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
  })("accounts/fireworks/models/deepseek-v3"),
  groq: createGroq({
    apiKey: process.env.GROQ_API_KEY,
  })("llama-3.3-70b-specdec"),
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })("o3-mini"),
};

const app = create({
  model: models.mistral,
  tools,
});

export default {
  port: 4000,
  fetch: app.fetch,
};
