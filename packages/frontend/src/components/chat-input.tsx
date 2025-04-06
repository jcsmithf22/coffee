import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { PromptSuggestion } from "@/components/ui/prompt-suggestion";
import { promptSuggestions } from "@/lib/prompt-suggestions";

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  setInputValue: (value: string) => void;
  handleClear: () => void;
  processing: boolean;
  error: Error | undefined;
  reload: () => void;
  messages?: Array<any>;
}

export function ChatInput({
  input,
  handleInputChange,
  setInputValue,
  handleSubmit,
  handleClear,
  processing,
  error,
  reload,
  messages = [],
}: ChatInputProps) {
  return (
    <div className="fixed bottom-0 w-full max-w-2xl mb-8 z-20">
      {messages.length === 0 && (
        <div className="flex gap-2 flex-wrap">
          {promptSuggestions.map((suggestion, index) => (
            <PromptSuggestion
              key={index}
              onClick={() => setInputValue(suggestion.prompt)}
            >
              {suggestion.text}
            </PromptSuggestion>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="grid gap-2 bg-secondary p-1.5 border rounded-2xl shadow-sm">
          <Textarea
            className="rounded-lg bg-background dark:bg-background shadow-lg resize-none"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                const form = e.currentTarget.form;
                if (form) {
                  handleSubmit(
                    new Event(
                      "submit",
                    ) as unknown as React.FormEvent<HTMLFormElement>,
                  );
                }
              }
            }}
          />
          <div className="flex items-center justify-between">
            <div>
              {processing && !error && (
                <div className="text-sm text-muted-foreground ml-2">
                  Thinking
                  <span className="animate-dots" />
                </div>
              )}
              {error && (
                <div className="text-sm text-red-600 ml-2">{error.message}</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {error && (
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => reload()}
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
  );
}
