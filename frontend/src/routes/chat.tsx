import { Sidebar } from "@/components/sidebar";
import Message from "@/components/message";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  cartQueryOptions,
  orderQueryOptions,
  subscriptionQueryOptions,
} from "@/lib/queries";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
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
      // console.log("scrolling to bottom");
      // rootRef.current.scrollTo(0, rootRef.current.scrollHeight);
      rootRef.current.scrollTo({
        top: rootRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // console.log(status);

  console.log(messages);

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

            <form
              onSubmit={handleSubmit}
              className="fixed bottom-0 w-full max-w-2xl mb-8 z-20"
            >
              <div className="grid gap-2 bg-secondary p-1.5 border rounded-2xl shadow-sm">
                <Textarea
                  className="rounded-lg bg-background dark:bg-background shadow-lg resize-none"
                  value={input}
                  placeholder="Say something..."
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <div className="flex items-center justify-between">
                  <div>
                    {processing && !error && (
                      <div className="text-sm text-muted-foreground ml-2">
                        Thinking...
                      </div>
                    )}
                    {error && (
                      <div className="text-sm text-red-600 ml-2">
                        Something went wrong.
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {error && (
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => reload}
                      >
                        Retry
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="rounded-lg"
                      type="button"
                      onClick={handleClear}
                      disabled={processing}
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
