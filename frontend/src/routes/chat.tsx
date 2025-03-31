import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";
import Message from "@/components/Message";

export const Route = createFileRoute("/chat")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
    setMessages,
  } = useChat({
    api: "http://localhost:4000/generate",
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "get_cart") {
        console.log("get_cart tool called");
      }
    },
  });

  const handleClear = () => {
    setMessages([]);
  };

  const rootRef = useRef<HTMLDivElement>(null);

  const processing = status !== "ready";

  useEffect(() => {
    if (rootRef.current) {
      console.log("scrolling to bottom");
      rootRef.current.scrollTo(0, rootRef.current.scrollHeight);
    }
  }, [messages]);

  return (
    <div ref={rootRef} className="h-screen overflow-y-scroll">
      <div
        ref={rootRef}
        className="flex flex-col w-full max-w-2xl py-24 pb-40 mx-auto stretch"
      >
        {messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}

        <form
          onSubmit={handleSubmit}
          className="fixed bottom-0 w-full max-w-2xl mb-8"
        >
          <div className="grid gap-2 bg-secondary p-1.5 border rounded-2xl shadow-sm">
            <Textarea
              className="rounded-lg bg-background shadow-lg resize-none"
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
                {processing && (
                  <div className="text-sm text-muted-foreground ml-2">
                    Thinking...
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
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
  );
}
