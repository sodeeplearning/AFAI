export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model: string;
};

export type ChatHistory = {
  [modelName: string]: ChatMessage[];
};

export type GetChatHistoryResponse = {
  data: ChatHistory;
};