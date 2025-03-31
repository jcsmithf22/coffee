import { createClient } from "@/lib/client";
import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { useAtom } from "jotai";
import { promptAtom, processingAtom, getInitialPrompt } from "@/lib/atoms";
import ToolCallMessage from "@/components/ToolCallMessage";
import { addMessage } from "@/lib/utils";
import type { GenerateResult, ToolCallResult } from "@/lib/types";

import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChatCard } from "@/components/ChatCard";
import { Send } from "lucide-react";


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

const providerMetadata = {
  anthropic: {
    cacheControl: {
      type: "ephemeral",
    },
  },
};

function RouteComponent() {
  const { client, tools } = useLoaderData({ from: Route.id });

  const [prompt, setPrompt] = useAtom(promptAtom);
  const [processing, setProcessing] = useAtom(processingAtom);

  const rootRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (rootRef.current) {
      console.log("scrolling to bottom");
      rootRef.current.scrollTo(0, rootRef.current.scrollHeight);
    }
  }, [prompt.length]);

  function clearConversation() {
    setPrompt(getInitialPrompt());
  }


  async function send(message: string) {
    let newMessage = addMessage(prompt, "user", {
      type: "text",
      text: message,
      providerMetadata: prompt.length === 1 ? providerMetadata : {},
    })

    setPrompt(newMessage)
    setProcessing(true);

    if (textareaRef.current) textareaRef.current.value = '';

    while (true) {
      console.log("beginning of loop")

      const response = await client.generate.$post({
        json: {
          prompt: newMessage,
          mode: {
            type: "regular",
            tools: (await tools).map((tool: any) => ({
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
      })

      if (!response.ok) {
        console.error("Error:", response);
        setProcessing(false);
        break;
      }

      const result = await response.json() as GenerateResult;

      if (result.text) {
        newMessage = addMessage(newMessage, "assistant", {
          type: "text",
          text: result.text,
        })
        setPrompt(newMessage);
      }

      if (result.finishReason === "stop") {
        setProcessing(false);
        break
      }

      if (result.finishReason === "tool-calls") {
        for (const item of result.toolCalls!) {
          console.log("calling tool", item.toolName, item.args)
          newMessage = addMessage(newMessage, "assistant", {
            type: "tool-call",
            toolName: item.toolName,
            args: JSON.parse(item.args),
            toolCallId: item.toolCallId,
          })
          setPrompt(newMessage);

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

          const { result } = await response.json() as ToolCallResult;
          if ("content" in result) {
            console.log("tool result", result)
            newMessage = addMessage(newMessage, "tool", {
              type: "tool-result",
              toolName: item.toolName,
              toolCallId: item.toolCallId,
              result: result.content,
            })
            setPrompt(newMessage);
          } else break
        }
      }

    }

  }

  return (
    <div
      data-component="chat"
      ref={rootRef}
      className="p-4 max-w-3xl mx-auto h-[calc(100vh-120px)] overflow-y-auto no-scrollbar"
    >
      <div className="mb-4">
        {prompt
          .filter(message => message.role !== 'system')
          .map((message, index) => (
            <div key={index}>
              {message.role === "user" && message.content[0].type === "text" && (
                <ChatCard title="User">
                  {message.content[0].text}
                </ChatCard>
              )}

              {message.role === "assistant" &&
                message.content[0].type === "tool-call" && (
                  <ToolCallMessage
                    key={index}
                    toolName={message.content[0].toolName}
                    args={message.content[0].args}
                  />
                )}

              {message.role === "assistant" && message.content[0].type === "text" && (
                <ChatCard title="Assistant">
                  {message.content[0].text}
                </ChatCard>
              )}
            </div>
          ))}
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (textareaRef.current?.value) {
            await send(textareaRef.current.value);
          }
        }}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }}
      >
        <div className="grid gap-2 bg-secondary p-1.5 border rounded-2xl shadow-sm">
          <Textarea ref={textareaRef} className="rounded-lg bg-background shadow-lg resize-none" />
          <div className="flex items-center justify-between">
            <div>

              {processing && (
                <div className="text-sm text-muted-foreground ml-2">
                  Thinking...
                </div>
              )
              }
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-lg"
                type="button"
                onClick={clearConversation}
              >
                Clear
              </Button>
              <Button
                className="rounded-lg"
                size="icon"
                type="submit"
                disabled={processing}
              >
                <Send className="mr-px" />
              </Button>
            </div>
          </div>
        </div>
      </form >
    </div >
  );
}
