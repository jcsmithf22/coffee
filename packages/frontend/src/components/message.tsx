import { memo } from "react";
import { ChatCard } from "@/components/chat-card";
import ToolCallMessage from "@/components/tool-call-message";
import type { Message } from "@ai-sdk/react";
// import { Markdown } from "@/components/ui/markdown";
// import { useRateLimitedCharacters } from "@/hooks/rate-limit";

type MessageProps = {
  m: Message;
};

interface TextStreamProps {
  text: string;
}

function WordStream({ text }: TextStreamProps) {
  // const streamedText = useRateLimitedCharacters(text, 0.01)
  const wordList = text.split("");

  return (
    // <Markdown className="prose text-sm prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-small prose-h5:text-xs prose-h6:text-xs fade-in-children">
    //   {text}
    <>
      {wordList.map((word, index) => (
        <span key={index} className="fade-in opacity-0">
          {word}
        </span>
      ))}
    </>
    // </Markdown>
  );
}

function Message({ m }: MessageProps) {
  return (
    <div>
      {m.parts?.map((part, index) => {
        switch (part.type) {
          // render text parts as simple text:
          case "text":
            const title =
              m.role === "user"
                ? "You"
                : m.role === "assistant"
                  ? "Assistant"
                  : m.role;
            return (
              <ChatCard key={index} title={title}>
                {m.role === "user" ? (
                  part.text
                ) : (
                  <WordStream text={part.text} />
                )}
              </ChatCard>
            );
          case "tool-invocation": {
            const callId = part.toolInvocation.toolCallId;
            const toolName = part.toolInvocation.toolName;
            const args = part.toolInvocation.args;

            switch (part.toolInvocation.state) {
              case "partial-call":
                return (
                  <div key={callId}>
                    <ToolCallMessage toolName={toolName} args={args} />
                  </div>
                );
              case "call":
                return (
                  <div key={callId}>
                    <ToolCallMessage toolName={toolName} args={args} />
                  </div>
                );
              case "result":
                return (
                  <div key={callId}>
                    <ToolCallMessage
                      toolName={toolName}
                      args={args}
                      results={part.toolInvocation.result}
                    />
                  </div>
                );
            }
          }
        }
      })}
    </div>
  );
}

export default memo(Message);
