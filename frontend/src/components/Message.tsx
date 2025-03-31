import React, { useRef, useState, useEffect } from 'react';
import { ChatCard } from "./ChatCard";
import ToolCallMessage from "./ToolCallMessage";
import type { Message } from "@ai-sdk/react"
import { streamWords } from '@/lib/utils';

type MessageProps = {
  m: Message
}

interface TextStreamProps {
  text: string;
}

function TextStream({ text }: TextStreamProps) {
  const [textParts, setTextParts] = useState<string[]>([]);
  const prevTextLength = useRef(0);

  useEffect(() => {
    if (text.length > prevTextLength.current) {
      const newText = text.slice(prevTextLength.current);
      setTextParts(prev => [...prev, newText]);
      prevTextLength.current = text.length;
    }
  }, [text])

  return (
    <>
      {textParts.map((part, index) => (
        <span key={index} className="fade-in">
          {part}
        </span>
      ))}
    </>
  );
}

function Message({ m }: MessageProps) {
  return (
    <div>
      {m.parts?.map(part => {
        switch (part.type) {
          // render text parts as simple text:
          case 'text':
            const title = m.role === 'user' ? 'You' : m.role === 'assistant' ? 'Assistant' : m.role;
            streamWords(part.text, (word) => {
              console.log("streaming word:", word);
            });
            return (
              <div key={m.id}>
                <ChatCard title={title}>
                  {m.role === 'user' ? part.text : (
                    <TextStream text={part.text} />
                  )}
                </ChatCard>
              </div>
            )
          case 'tool-invocation': {
            const callId = part.toolInvocation.toolCallId;
            const toolName = part.toolInvocation.toolName;
            const args = part.toolInvocation.args;

            switch (part.toolInvocation.state) {
              case 'partial-call':
                return (
                  <div key={callId}>
                    <ToolCallMessage toolName={toolName} args={args} />
                  </div>
                );
              case 'call':
                return (
                  <div key={callId}>
                    <ToolCallMessage toolName={toolName} args={args} />
                  </div>
                );
              case 'result':
                return (
                  <div key={callId}>
                    <ToolCallMessage toolName={toolName} args={args} results={part.toolInvocation.result} />
                  </div>
                );
            }
          }
        }
      })}
    </div>
  )
}

export default React.memo(Message);
