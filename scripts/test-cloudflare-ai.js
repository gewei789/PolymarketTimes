// Test script for Cloudflare AI API
// Run with: node scripts/test-cloudflare-ai.js

require('dotenv').config({ path: '.env.local' });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const authToken = process.env.CLOUDFLARE_AUTH_TOKEN;

if (!accountId || !authToken) {
  console.error('Missing CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_AUTH_TOKEN in .env.local');
  process.exit(1);
}

async function testCloudflareAI() {
  const messages = [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' }
  ];

  try {
    console.log('Testing Cloudflare AI API...');
    console.log('Account ID:', accountId.substring(0, 10) + '...');
    console.log('Auth Token:', authToken.substring(0, 10) + '...');
    console.log('Messages:', JSON.stringify(messages, null, 2));
    console.log('\nSending request...\n');

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

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseText = await response.text();
    console.log('\nRaw response text:');
    console.log(responseText);
    console.log('\n');

    if (!response.ok) {
      console.error('API call failed!');
      try {
        const errorJson = JSON.parse(responseText);
        console.error('Error JSON:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error('Error is not JSON');
      }
      process.exit(1);
    }

    try {
      const data = JSON.parse(responseText);
      console.log('Parsed response JSON:');
      console.log(JSON.stringify(data, null, 2));
      console.log('\n');
      
      // Try to extract message
      let message = '';
      if (typeof data === 'string') {
        message = data;
      } else if (data.response) {
        message = typeof data.response === 'string' ? data.response : data.response.text || '';
      } else if (data.result) {
        if (typeof data.result === 'string') {
          message = data.result;
        } else if (data.result.response) {
          message = data.result.response;
        }
      } else if (data.text) {
        message = data.text;
      } else if (data.message) {
        message = data.message;
      }

      if (message) {
        console.log('✅ Extracted message:', message);
      } else {
        console.log('⚠️  Could not extract message from response');
        console.log('Response structure:', Object.keys(data));
      }
    } catch (e) {
      console.log('Response is not JSON, raw text:', responseText);
    }

  } catch (error) {
    console.error('Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

testCloudflareAI();
