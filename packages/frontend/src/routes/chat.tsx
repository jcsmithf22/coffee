import { Sidebar } from "@/components/sidebar";
import Message from "@/components/message";
import { ChatInput } from "@/components/chat-input";
import {
  cartQueryOptions,
  orderQueryOptions,
  subscriptionQueryOptions,
} from "@/lib/queries";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/chat")({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(cartQueryOptions);
    queryClient.ensureQueryData(orderQueryOptions);
    queryClient.ensureQueryData(subscriptionQueryOptions);
  },
  component: RouteComponent,
});

type TabType = "cart" | "orders" | "subscriptions";

function RouteComponent() {
  // const { queryClient } = useLoaderData({ from: "/chat" })
  const [tab, setTab] = useState<TabType>("cart");
  const queryClient = useQueryClient();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
    error,
    reload,
  } = useChat({
    api: "http://localhost:4000/generate",
    maxSteps: 50,
    onFinish() {
      queryClient.invalidateQueries({ queryKey: ["terminal"], type: "all" });
    },
    onError(error) {
      console.log("ERROR:", error.message);
    },
    async onToolCall({ toolCall }) {
      if (toolCall.toolName.toLowerCase().includes("cart")) {
        setTab("cart");
        queryClient.invalidateQueries({
          queryKey: ["terminal", "cart"],
          type: "all",
        });
      }
      if (toolCall.toolName.toLowerCase().includes("order")) {
        setTab("orders");
        queryClient.invalidateQueries({
          queryKey: ["terminal", "orders"],
          type: "all",
        });
      }
      if (toolCall.toolName.toLowerCase().includes("subscription")) {
        setTab("subscriptions");
        queryClient.invalidateQueries({
          queryKey: ["terminal", "subscriptions"],
          type: "all",
        });
      }
    },
  });

  const handleClear = () => {
    setMessages([]);
  };

  const rootRef = useRef<HTMLDivElement>(null);

  const processing = status !== "ready" && status !== "error";

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.scrollTo({
        top: rootRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex bg-secondary overflow-hidden">
      <Sidebar tab={tab} setTab={setTab} />
      <div className="h-screen w-full p-2 pr-0 relative">
        <div
          className="absolute h-24 w-full top-2 rounded-t-2xl z-10 pr-5"
          style={{
            mask: "linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          <div className="bg-background/90 size-full"></div>
        </div>
        <div
          className="absolute h-24 w-full bottom-2 rounded-t-2xl rotate-180 z-10 pl-5"
          style={{
            mask: "linear-gradient(rgb(0, 0, 0) 20%, rgba(0, 0, 0, 0) 100%)",
          }}
        >
          <div className="bg-background/90 size-full"></div>
        </div>
        <div
          ref={rootRef}
          className="rounded-l-2xl bg-background ring-1 ring-border shadow-lg h-full overflow-y-scroll overflow-x-hidden"
        >
          <div className="flex flex-col w-full max-w-2xl pt-24 pb-40 mx-auto stretch">
            {messages.map((m, index) => (
              <Message key={index} m={m} />
            ))}

            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              handleClear={handleClear}
              processing={processing}
              error={error}
              reload={reload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
