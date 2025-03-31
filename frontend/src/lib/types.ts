import type { 
  LanguageModelV1FunctionToolCall,
  LanguageModelV1FinishReason,
  LanguageModelV1CallWarning,
  LanguageModelV1ProviderMetadata,
  LanguageModelV1Source,
  LanguageModelV1LogProbs
} from "@ai-sdk/provider";

import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"

export type GenerateResult = {
  text?: string;
  reasoning?: string | Array<{
    type: 'text';
    text: string;
    signature?: string;
  } | {
    type: 'redacted';
    data: string;
  }>;
  files?: Array<{
    data: string | Uint8Array;
    mimeType: string;
  }>;
  toolCalls?: Array<LanguageModelV1FunctionToolCall>;
  finishReason: LanguageModelV1FinishReason;
  usage: {
    promptTokens: number;
    completionTokens: number;
  };
  rawCall: {
    rawPrompt: unknown;
    rawSettings: Record<string, unknown>;
  };
  rawResponse?: {
    headers?: Record<string, string>;
    body?: unknown;
  };
  request?: {
    body?: string;
  };
  response?: {
    id?: string;
    timestamp?: Date;
    modelId?: string;
  };
  warnings?: LanguageModelV1CallWarning[];
  providerMetadata?: LanguageModelV1ProviderMetadata;
  sources?: LanguageModelV1Source[];
  logprobs?: LanguageModelV1LogProbs;
};
  
export type ToolCallResult = {
    jsonrpc: "2.0";
    id: string | number,
    result: CallToolResult,
}