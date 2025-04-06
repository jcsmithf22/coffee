type PromptSuggestion = {
  text: string;
  prompt: string;
};

export const promptSuggestions: PromptSuggestion[] = [
  {
    text: "Show me products",
    prompt: "Show me what products are available in the store"
  },
  {
    text: "View my cart",
    prompt: "What's in my shopping cart right now?"
  },
  {
    text: "Order status",
    prompt: "Check the status of my recent orders"
  },
  {
    text: "Subscription options",
    prompt: "What subscription options are available for coffee?"
  },
  {
    text: "Update profile",
    prompt: "I need to update my profile information"
  },
  {
    text: "Shipping address",
    prompt: "Help me manage my shipping addresses"
  }
];