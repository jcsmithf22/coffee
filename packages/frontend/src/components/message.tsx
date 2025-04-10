import { memo } from "react";
import { ChatCard } from "@/components/chat-card";
import ToolCallMessage from "@/components/tool-call-message";
import type { Message } from "@ai-sdk/react";
// import { Markdown } from "@/components/ui/markdown";
// import { marked } from "marked";
import ReactMarkdown from "marked-react";
// import { useRateLimitedCharacters } from "@/hooks/rate-limit";
import Terminal from "@/assets/icon.png";
import User from "@/assets/user.png";
// import System from "@/assets/system.png";
// import Data from "@/assets/data.png";

type MessageProps = {
  m: Message;
};

interface TextStreamProps {
  text: string;
}

function WordStream({ text }: TextStreamProps) {
  // const streamedText = useRateLimitedCharacters(text, 0.01)
  // const wordList = text.split("");
  // const markdown = marked.parse(text);

  return (
    // <Markdown className="prose text-sm prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-small prose-h5:text-xs prose-h6:text-xs">
    <div className="prose text-sm prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-h4:text-small prose-h5:text-xs prose-h6:text-xs">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
    //   {/* <>
    //   {wordList.map((word, index) => (
    //     <span key={index} className="fade-in opacity-0">
    //       {word}
    //     </span>
    //   ))}
    // </> */}
    // </Markdown>
  );
}

type RoleMapping = {
  [key: string]: {
    title: string;
    icon?: string;
  };
};

// Map of roles to their respective icons and titles
const roleMapping: RoleMapping = {
  user: { title: "You", icon: User },
  assistant: { title: "terminal", icon: Terminal },
  system: { title: "System" },
  data: { title: "Data" },
};

function Message({ m }: MessageProps) {
  console.log(m);
  return (
    <div>
      {m.parts?.map((part, index) => {
        switch (part.type) {
          // render text parts as simple text:
          case "text":
            if (
              part.text.startsWith("<|python_start|>") ||
              part.text.trim() === ""
            )
              return;
            const role = m.role as keyof typeof roleMapping;
            const roleDetails = roleMapping[role] || {
              title: m.role,
              icon: undefined,
            };
            return (
              <ChatCard
                key={index}
                title={roleDetails.title}
                icon={roleDetails.icon}
              >
                {m.role === "user" ? (
                  part.text
                ) : (
                  <WordStream text={part.text} />
                )}
                {/* {part.text} */}
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
