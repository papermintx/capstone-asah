/**
 * Base LLM Interface
 * Common interface for all LLM providers (Gemini, Groq, etc.)
 */

import { BaseChatModel } from '@langchain/core/language_models/chat_models';

export interface BaseLLM {
  getModel(): BaseChatModel;
  getSystemPrompt(): string;
}
