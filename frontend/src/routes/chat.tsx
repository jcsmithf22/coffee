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

  const [store, _setStore] = useState<{
    prompt: LanguageModelV1Prompt;
    isProcessing: boolean;
    rate: boolean;
  }>({
    rate: false,
    prompt: getInitialPrompt(),
    isProcessing: false,
  });

  function setStore(key: string, value: any) {
    _setStore((prev) => ({ ...prev, [key]: value }));
  }

  function clearConversation() {
    setStore("prompt", getInitialPrompt());
  }

  async function send(message: string) {
    setStore("isProcessing", true);
    setStore("prompt", store.prompt.length, {
      role: "user",
      content: [
        {
          type: "text",
          text: message,
          providerMetadata: store.prompt.length === 1 ? providerMetadata : {},
        },
      ],
    });

    while (true) {
      if (!store.isProcessing) {
        console.log("Processing cancelled by user");
        break;
      }

      const response = await client.generate.$post({
        json: {
          prompt: store.prompt,
          mode: {
            type: "regular",
            tools: tools.map((tool: any) => ({
              type: "function",
              name: tool.name,
              description: tool.description,
              parameters: {
                ...tool.inputSchema,
              },
            })),
          },
          inputFormat: "messages",
          temperature: 1,
        },
      });

      if (!store.isProcessing) continue;

      if (!response.ok) {
        if (response.status === 400) {
          setStore("prompt", (val) => {
            val.splice(2, 1);
            console.log(val);
            return [...val];
          });
        }
        if (response.status === 429) {
          setStore("rate", true);
        }
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      const result = await response.json();

      if (result.text) {
        setStore("prompt", store.prompt.length, {
          role: "assistant",
          content: [
            {
              type: "text",
              text: result.text,
            },
          ],
        });
      }

      setStore("rate", false);

      if (result.finishReason === "stop") {
        setStore("isProcessing", false);
        break;
      }

      if (result.finishReason === "tool-calls") {
        for (const item of result.toolCalls!) {
          console.log("calling tool", item.toolName, item.args);
          setStore("prompt", store.prompt.length, {
            role: "assistant",
            content: [
              {
                type: "tool-call",
                toolName: item.toolName,
                args: JSON.parse(item.args),
                toolCallId: item.toolCallId,
              },
            ],
          });

          const response = await client.mcp
            .$post({
              json: {
                jsonrpc: "2.0",
                id: "2",
                method: "tools/call",
                params: {
                  name: item.toolName,
                  arguments: JSON.parse(item.args),
                },
              },
            })
            .then((r) => r.json());
          if ("content" in response.result) {
            setStore("prompt", store.prompt.length, {
              role: "tool",
              content: [
                {
                  type: "tool-result",
                  toolName: item.toolName,
                  toolCallId: item.toolCallId,
                  result: response.result.content,
                },
              ],
            });
          } else break;
        }
      }
    }
    setStore("isProcessing", false);
    textarea?.focus();
  }

  return <div>Hi</div>;
}
