export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export type ChatHistory = {
  [modelName: string]: ChatMessage[];
};

export type GetChatHistoryResponse = {
  data: ChatHistory;
};