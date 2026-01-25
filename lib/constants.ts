export const MAX_Z_INDEX = 100;
export const CHAT_GPT_SELECTOR_MAP: { [key: string]: string; } = {
  "user": '[data-turn="user"]',
  "assistant": '[data-turn="assistant"]',
  "code blocks": 'pre',
  "section headers": 'h1, h2, h3'
};
export const GEMINI_SELECTOR_MAP: Record<string, string> = {
  "user": 'user-query',
  "assistant": 'model-response',
  "code blocks": 'pre',
  "section headers": 'h1, h2, h3'
};
export const CLAUDE_SELECTOR_MAP: Record<string, string> = {
  "user": '[data-testid="user-message"]',
  "assistant": '[data-is-streaming]',
  "code blocks": '[data-is-streaming] pre',
  "section headers": 'h1, h2, h3'
}
export const SELECTOR_MAP: Record<chatProviders, Record<string, string>> = {
  "chatgpt": CHAT_GPT_SELECTOR_MAP,
  "gemini": GEMINI_SELECTOR_MAP,
  "claude": CLAUDE_SELECTOR_MAP
}
export type chatProviders = "chatgpt" | "gemini" | "claude"
