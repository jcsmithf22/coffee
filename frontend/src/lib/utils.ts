import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function streamWords(textStream: string, onWord: (word: string) => void, intervalMs = 500) {
  let words = textStream.split(/\s+/);
  let currentIndex = 0;
  
  const interval = setInterval(() => {
    if (currentIndex < words.length) {
      const word = words[currentIndex].replace(/[^\w]/g, '');
      if (word) {
        onWord(word);
      }
      currentIndex++;
    } else {
      clearInterval(interval);
    }
  }, intervalMs);

  return {
    stop: () => clearInterval(interval)
  };
}
