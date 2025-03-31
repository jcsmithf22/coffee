import { atom } from 'jotai';
import type { LanguageModelV1Prompt } from "ai";
import SYSTEM_PROMPT from "./system.txt?raw";

// Define initial system messages
export const getInitialPrompt = (): LanguageModelV1Prompt => [
  {
    role: "system",
    content: SYSTEM_PROMPT,
    providerMetadata: {
      anthropic: {
        cacheControl: {
          type: "ephemeral",
        },
      },
    },
  },
  {
    role: "system",
    content: `The current date is ${new Date().toDateString()}`,
    providerMetadata: {
      anthropic: {
        cacheControl: {
          type: "ephemeral",
        },
      },
    },
  },
];

// Create atoms for state management
export const promptAtom = atom<LanguageModelV1Prompt>(getInitialPrompt());
export const processingAtom = atom<boolean>(false);
