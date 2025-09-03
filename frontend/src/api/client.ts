// Enhanced API client with better error handling and type safety

export interface StreamEvent {
  type: 'meta' | 'token' | 'error';
  data: any;
}

export interface QueryOptions {
  query: string;
  sources?: string[];
  stream?: boolean;
}

export async function* streamQuery(body: QueryOptions): AsyncGenerator<StreamEvent> {
  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...body, stream: true })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    if (!res.body) {
      throw new Error('No response body received');
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // Keep incomplete line in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') {
          return;
        }

        try {
          const obj = JSON.parse(payload);
          
          // Handle different event types
          if (obj?.type === 'meta') {
            yield { type: 'meta', data: obj };
          } else if (obj?.type === 'error') {
            yield { type: 'error', data: obj };
            return;
          } else if (obj?.choices?.[0]?.delta?.content) {
            yield { type: 'token', data: obj.choices[0].delta.content };
          }
        } catch (parseError) {
          console.warn('Failed to parse SSE data:', payload);
          // Continue processing other lines
        }
      }
    }
  } catch (error) {
    console.error('Streaming error:', error);
    yield { 
      type: 'error', 
      data: { 
        message: error instanceof Error ? error.message : 'Unknown streaming error' 
      } 
    };
  }
}

export async function getSources() {
  try {
    const res = await fetch('/api/sources');
    if (!res.ok) {
      throw new Error(`Failed to fetch sources: ${res.status} ${res.statusText}`);
    }
    return res.json() as Promise<{ 
      sources: Array<{ 
        key: string; 
        title: string; 
        description: string 
      }> 
    }>;
  } catch (error) {
    console.error('Failed to fetch sources:', error);
    throw error;
  }
}

// Non-streaming query function for testing
export async function queryNonStream(body: QueryOptions) {
  try {
    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...body, stream: false })
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Health check function
export async function checkHealth() {
  try {
    const res = await fetch('/health');
    if (!res.ok) {
      throw new Error(`Health check failed: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}