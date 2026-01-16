import { NextResponse } from 'next/server';

// Use nodejs runtime for better compatibility with Cloudflare API
export const runtime = 'nodejs';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function POST(request: Request) {
  try {
    const { messages } = await request.json() as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    // Support both CLOUDFLARE_AUTH_TOKEN and CLOUDFLARE_API_TOKEN
    const authToken = process.env.CLOUDFLARE_AUTH_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

    if (!accountId || !authToken) {
      console.error('Missing Cloudflare credentials');
      console.error('Account ID:', accountId ? 'Set' : 'Missing');
      console.error('Auth Token:', authToken ? 'Set' : 'Missing');
      console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('CLOUDFLARE')).join(', '));
      return NextResponse.json(
        { 
          error: 'AI service not configured',
          details: 'Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN. Please check your environment variables in Vercel settings.',
        },
        { status: 500 }
      );
    }

    // Call Cloudflare AI API
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      }
    );

    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
        // Try to parse as JSON for better error messages
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Cloudflare AI API error (JSON):', response.status, JSON.stringify(errorJson));
          return NextResponse.json(
            { 
              error: 'AI service error', 
              details: errorJson.errors?.[0]?.message || errorJson.message || errorText,
              status: response.status
            },
            { status: response.status }
          );
        } catch {
          // Not JSON, use as text
          console.error('Cloudflare AI API error (text):', response.status, errorText);
        }
      } catch (e) {
        errorText = `HTTP ${response.status}: ${response.statusText}`;
        console.error('Cloudflare AI API error (no body):', response.status);
      }
      
      return NextResponse.json(
        { 
          error: 'AI service error', 
          details: errorText || `HTTP ${response.status}`,
          status: response.status
        },
        { status: response.status }
      );
    }

    // Cloudflare Workers AI response format:
    // {
    //   "result": {
    //     "response": "message text here",
    //     "usage": { ... }
    //   },
    //   "success": true,
    //   "errors": [],
    //   "messages": []
    // }
    const contentType = response.headers.get('content-type') || '';
    let message = '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      
      // Log the full response for debugging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('Cloudflare AI API response (JSON):', JSON.stringify(data).substring(0, 500));
      }
      
      // Cloudflare API returns: { result: { response: "..." } }
      if (data.result && data.result.response) {
        message = data.result.response;
      } else if (data.result && typeof data.result === 'string') {
        message = data.result;
      } else if (data.response) {
        message = typeof data.response === 'string' ? data.response : data.response.text || '';
      } else if (data.result && data.result.text) {
        message = data.result.text;
      } else if (data.result && data.result.message) {
        message = data.result.message;
      } else if (data.text) {
        message = data.text;
      } else if (data.message) {
        message = data.message;
      } else if (typeof data === 'string') {
        message = data;
      } else {
        // Last resort: try to find any string value in the response
        const stringValues = Object.values(data).filter(v => typeof v === 'string');
        if (stringValues.length > 0) {
          message = stringValues[0] as string;
        } else {
          console.error('Unexpected response format:', JSON.stringify(data).substring(0, 500));
          return NextResponse.json(
            { 
              error: 'Invalid response format',
              details: 'Could not extract message from AI response.',
            },
            { status: 500 }
          );
        }
      }
    } else {
      // Response is plain text or stream
      const text = await response.text();
      if (process.env.NODE_ENV === 'development') {
        console.log('Cloudflare AI API response (text):', text.substring(0, 500));
      }
      message = text;
    }
    
    if (!message || message.trim() === '') {
      console.error('Failed to extract message from Cloudflare response');
      return NextResponse.json(
        { 
          error: 'Invalid response format',
          details: 'Could not extract message from AI response. Please check server logs for details.',
        },
        { status: 500 }
      );
    }
    
    // Return only the message content, no metadata
    return NextResponse.json({
      message: message.trim(),
    });

  } catch (error) {
    console.error('Error in AI chat API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process chat request', details: errorMessage },
      { status: 500 }
    );
  }
}
