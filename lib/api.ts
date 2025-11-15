/**
 * API client for backend communication
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ContextItem {
  instruction: string;
  output: string;
  similarity: number;
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

/**
 * Query the chatbot
 */
export async function queryChat(question: string, top_k: number = 5): Promise<QueryResponse> {
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
