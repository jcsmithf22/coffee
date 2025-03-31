import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface ToolCallMessageProps {
  toolName: string;
  args: any;
  results?: any;
}

export default function ToolCallMessage({
  toolName,
  args,
  results,
}: ToolCallMessageProps) {
  const [showArgs, setShowArgs] = useState(false);

  const toggleArgs = () => {
    setShowArgs((prev) => !prev);
  };

  return (
    <div className="mb-4">
      <div>
        <div
          className="inset-shadow-sm bg-muted rounded-2xl cursor-pointer w-fit px-3 py-1.5 flex items-center"
          onClick={toggleArgs}
        >
          <span>🔧</span>
          <span className="ml-2 text-sm text-muted-foreground">{toolName}</span>
          <span className="ml-2">
            <ChevronDown
              size={16}
              className={cn(
                "transition-transform duration-300",
                showArgs || "-rotate-180"
              )}
            />
          </span>
        </div>
      </div>
      <AnimatePresence>
        {showArgs && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="inset-shadow-sm bg-muted rounded-2xl cursor-pointer px-3 py-1.5 flex flex-col gap-2 w-full mt-2 text-xs overflow-x-scroll overflow-y-hidden">
              <span className="text-sm text-muted-foreground">Arguments</span>
              <pre>{JSON.stringify(args, null, 2)}</pre>
              {results && (
                <>
                  <span className="text-sm text-muted-foreground">Results</span>
                  <pre>{JSON.stringify(results, null, 2)}</pre>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
