export type SourceKey = 'coingecko' | 'arxiv' | 'openmeteo';

export interface ExternalSourceResult {
  key: SourceKey;
  title: string;
  used: boolean;
  items: Array<{ title: string; url?: string; snippet?: string; data?: any }>;
}

export interface AgentQueryBody {
  query: string;
  sources?: SourceKey[];
  stream?: boolean;
}

export interface AgentResponseMeta {
  usedSources: SourceKey[];
  model: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface OpenAIChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  top_p?: number;
}

export interface OpenAIStreamDelta {
  id?: string;
  object?: string;
  model?: string;
  choices?: Array<{ delta?: { content?: string }, finish_reason?: string }>;
}
