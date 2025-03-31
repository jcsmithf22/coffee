import { useState, useEffect, useRef } from "react";

export function useRateLimitedCharacters(
  fullText: string,
  delayMs: number,
): string {
  // State to hold the currently displayed portion of the text
  const [displayedText, setDisplayedText] = useState("");
  // Ref to keep track of the index of the *next* character to display.
  // useRef is used because we want to persist this value across re-renders
  // without causing re-renders ourselves when it changes.
  const currentIndexRef = useRef(0);
  // Ref to store the timeout ID, allowing us to clear it on cleanup
  // or when dependencies change.
  const timerRef = useRef<number>(null); // Use number for browser

  // Ensure delay is not negative
  const safeDelayMs = Math.max(0, delayMs);

  useEffect(() => {
    // --- Effect runs when fullText or safeDelayMs changes ---

    // Function to schedule the next character update
    const scheduleNextCharacter = () => {
      // Clear any existing timer before setting a new one
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Check if there are more characters to display from the *current* fullText
      if (currentIndexRef.current < fullText.length) {
        timerRef.current = setTimeout(() => {
          // Append the next character to the displayed text
          setDisplayedText(
            (prev) => prev + fullText[currentIndexRef.current],
          );
          // Move to the next index
          currentIndexRef.current += 1;
          // Schedule the *next* character after this one
          // Note: We recursively call scheduleNextCharacter *after* the timeout
          //       fires and state is updated, rather than using setInterval,
          //       to ensure timing is relative to the *completion* of the
          //       previous step and state update.
          // scheduleNextCharacter(); // This was incorrect, scheduling happens implicitly on next render
        }, safeDelayMs);
      } else {
        // We've displayed all characters of the *current* fullText.
        // No more timeouts needed for *this* effect cycle.
        // If fullText changes later, the effect will run again.
        timerRef.current = null;
      }
    };

    // --- Logic to handle changes in fullText ---
    // When fullText changes, we need to potentially "catch up" or continue
    // the animation from where we left off.

    // If the current index is *behind* the length of the (potentially new)
    // fullText, it means we still have characters to display.
    if (currentIndexRef.current < fullText.length) {
      // Ensure the displayedText state is consistent with the currentIndex.
      // This handles cases where fullText might have changed completely,
      // although for LLM streams it usually just appends.
      // If the start of displayedText doesn't match the start of fullText
      // up to the current index, reset. (Optional, depends on desired behavior
      // if the string *replaces* content instead of just appending)
      // For simple appending streams, this check might be less critical.
      const expectedPrefix = fullText.substring(0, currentIndexRef.current);
      if (displayedText !== expectedPrefix) {
        // If the text changed drastically, update displayedText immediately
        // to the correct prefix based on the current index.
        // For LLM append-only streams, you might only need this if you
        // want to handle scenarios where the component unmounted/remounted.
        setDisplayedText(expectedPrefix);
      }

      // Schedule the *next* character to be displayed.
      scheduleNextCharacter();
    } else {
      // If currentIndexRef.current >= fullText.length, we might have
      // finished displaying a previous, shorter string.
      // Ensure the displayed text exactly matches the final fullText.
      // This handles cases where the effect re-runs after finishing,
      // or if the fullText shrunk (less common for LLM streams).
      if (displayedText !== fullText) {
        setDisplayedText(fullText);
      }
      // Clear any lingering timer if we've caught up
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    // --- Cleanup Function ---
    // This runs when the component unmounts or *before* the effect runs again
    // due to dependency changes (fullText, safeDelayMs).
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [fullText, safeDelayMs, displayedText]); // Include displayedText to trigger re-scheduling

  // This effect specifically handles resetting the index if the `fullText`
  // fundamentally changes (e.g., goes from "abc" to "xyz", not just "abc" to "abcd").
  // For typical LLM streams (append-only), this might be optional.
  const previousFullTextRef = useRef(fullText);
  useEffect(() => {
    // Basic check: If the new text doesn't start with the old text,
    // consider it a reset. You might need a more sophisticated check
    // depending on exact requirements.
    if (!fullText.startsWith(previousFullTextRef.current)) {
      // console.log("Text changed fundamentally, resetting.");
      // Reset index and displayed text
      currentIndexRef.current = 0;
      setDisplayedText("");
      // The main effect will then pick up from the beginning
    }
    // Update the ref *after* the check
    previousFullTextRef.current = fullText;
  }, [fullText]);


  // Return the currently visible part of the string
  return displayedText;
}