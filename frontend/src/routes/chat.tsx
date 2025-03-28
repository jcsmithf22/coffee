import { createClient } from "@/lib/client";
import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { useRef, useState } from "react";
import type { LanguageModelV1Prompt } from "ai";
import SYSTEM_PROMPT from "../lib/system.txt?raw";

import type { StandardSchemaV1 } from "@standard-schema/spec";

export interface Tool<
  Args extends undefined | StandardSchemaV1 = undefined | StandardSchemaV1,
> {
  name: string;
  description: string;
  args?: Args;
  run: Args extends StandardSchemaV1
    ? (args: StandardSchemaV1.InferOutput<Args>) => Promise<any>
    : () => Promise<any>;
}

type ToolResponse = {
  jsonrpc: "2.0";
  id: string;
  result: {
    tools: Array<Tool>;
  };
};

export const Route = createFileRoute("/chat")({
  beforeLoad: async () => {
    const getPassword = (): string | null => {
      const password = localStorage.getItem("opencontrol:password");
      if (!password) {
        const result = prompt("Enter password");
        if (result) {
          localStorage.setItem("opencontrol:password", result);
          return result;
        }
        return null;
      }
      return password;
    };

    const validatePassword = async (password: string) => {
      const client = createClient(password);
      const result = await client.auth.$get({
        json: {
          jsonrpc: "2.0",
          method: "initialize",
          id: "1",
        },
      });
      if (!result.ok) {
        localStorage.removeItem("opencontrol:password");
        throw redirect({ to: "/" });
      }
      return client;
    };

    const password = getPassword();
    if (!password) {
      throw redirect({ to: "/" });
    }

    const client = await validatePassword(password);
    return { client };
  },
  loader: async ({ context: { client } }) => {
    const response = await client.mcp.$post({
      json: {
        jsonrpc: "2.0",
        method: "tools/list",
        id: "1",
      },
    });
    const toolDefs = (await response.json()) as ToolResponse;
    const tools = toolDefs.result.tools;
    return { client, tools };
  },
  component: RouteComponent,
});

// Define initial system messages once
const getInitialPrompt = (): LanguageModelV1Prompt => [
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

function RouteComponent() {
  const { client, tools } = useLoaderData({ from: Route.id });

  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [state, setState] = useState<{
    prompt: LanguageModelV1Prompt;
    isProcessing: boolean;
    rate: boolean;
  }>({
    rate: false,
    prompt: getInitialPrompt(),
    isProcessing: false,
  });

  function setStore(key: string, value: any) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function clearConversation() {
    setStore("prompt", getInitialPrompt());
  }

  return <div>Hi</div>;
}
