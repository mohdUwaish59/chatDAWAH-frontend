/**
 * API client for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ContextItem {
  instruction: string;
  output: string;
  similarity: number;
  channel_username?: string;
  video_id?: string;
  source?: string;
}

export interface QueryRequest {
  question: string;
  top_k?: number;
}

export interface QueryResponse {
  answer: string;
  context: ContextItem[];
  question: string;
}

export interface HealthResponse {
  status: string;
  chatbot_ready: boolean;
  version: string;
}

export interface StatsResponse {
  total_documents: number;
  model: string;
  embedding_model: string;
  max_tokens: number;
  default_top_k: number;
}

export interface ConfigResponse {
  top_k: number;
  max_tokens: number;
  temperature: number;
  similarity_threshold: number;
  llm_provider: string;
  model: string;
  embedding_model: string;
  collection_name: string;
}

// Cache for config to avoid repeated API calls
let configCache: ConfigResponse | null = null;

/**
 * Get backend configuration
 */
export async function getConfig(): Promise<ConfigResponse> {
  if (configCache) {
    return configCache;
  }

  const response = await fetch(`${API_URL}/config`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const config: ConfigResponse = await response.json();
  configCache = config;
  return config;
}

/**
 * Query the chatbot
 */
export async function queryChat(question: string, top_k?: number): Promise<QueryResponse> {
  // If top_k not provided, fetch from backend config
  if (top_k === undefined) {
    try {
      const config = await getConfig();
      top_k = config.top_k;
    } catch (error) {
      console.warn('Failed to fetch config, using default top_k=10', error);
      top_k = 10;
    }
  }
  const response = await fetch(`${API_URL}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question, top_k }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Check backend health
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_URL}/health`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

/**
 * Get chatbot statistics
 */
export async function getStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_URL}/stats`);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
