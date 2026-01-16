/**
 * Test script for Cloudflare AI API
 * 
 * Usage:
 *   npx tsx scripts/test-cloudflare-ai.ts
 * 
 * Or compile and run:
 *   npx tsc scripts/test-cloudflare-ai.ts --esModuleInterop --moduleResolution node
 *   node scripts/test-cloudflare-ai.js
 */

import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
function loadEnv() {
  // Try multiple possible paths
  const possiblePaths = [
    path.join(process.cwd(), '.env.local'),
    path.join(__dirname, '..', '.env.local'),
    path.resolve('.env.local'),
  ];
  
  let envPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      envPath = p;
      break;
    }
  }
  
  if (envPath) {
    console.log(`📁 Loading .env.local from: ${envPath}\n`);
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envVars: Record<string, string> = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const equalIndex = trimmed.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim();
          let value = trimmed.substring(equalIndex + 1).trim();
          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || 
              (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          if (key && value) {
            envVars[key] = value;
          }
        }
      }
    });
    
    Object.assign(process.env, envVars);
    console.log(`✅ Loaded ${Object.keys(envVars).length} environment variables`);
    console.log(`📋 Loaded variable names: ${Object.keys(envVars).join(', ')}\n`);
    
    // Debug: Check if the specific variables exist
    if (envVars.CLOUDFLARE_ACCOUNT_ID) {
      console.log(`✅ Found CLOUDFLARE_ACCOUNT_ID (length: ${envVars.CLOUDFLARE_ACCOUNT_ID.length})`);
    } else {
      console.log(`❌ CLOUDFLARE_ACCOUNT_ID not found in loaded variables`);
      // Check for similar names
      const similar = Object.keys(envVars).filter(k => 
        k.toLowerCase().includes('cloudflare') || k.toLowerCase().includes('account')
      );
      if (similar.length > 0) {
        console.log(`   Similar variable names found: ${similar.join(', ')}`);
      }
    }
    
    if (envVars.CLOUDFLARE_AUTH_TOKEN) {
      console.log(`✅ Found CLOUDFLARE_AUTH_TOKEN (length: ${envVars.CLOUDFLARE_AUTH_TOKEN.length})`);
    } else {
      console.log(`❌ CLOUDFLARE_AUTH_TOKEN not found in loaded variables`);
      // Check for similar names
      const similar = Object.keys(envVars).filter(k => 
        k.toLowerCase().includes('cloudflare') || k.toLowerCase().includes('auth') || k.toLowerCase().includes('token')
      );
      if (similar.length > 0) {
        console.log(`   Similar variable names found: ${similar.join(', ')}`);
      }
    }
    console.log('');
  } else {
    console.warn('⚠️  .env.local file not found in any of these locations:');
    possiblePaths.forEach(p => console.warn(`   - ${p}`));
    console.warn('\nMake sure CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_AUTH_TOKEN are set.\n');
  }
}

loadEnv();

// Support both CLOUDFLARE_AUTH_TOKEN and CLOUDFLARE_API_TOKEN
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const authToken = process.env.CLOUDFLARE_AUTH_TOKEN || process.env.CLOUDFLARE_API_TOKEN;

if (!accountId || !authToken) {
  console.error('❌ Missing required environment variables');
  if (!accountId) {
    console.error('   ❌ CLOUDFLARE_ACCOUNT_ID not found');
  }
  if (!process.env.CLOUDFLARE_AUTH_TOKEN && !process.env.CLOUDFLARE_API_TOKEN) {
    console.error('   ❌ CLOUDFLARE_AUTH_TOKEN or CLOUDFLARE_API_TOKEN not found');
  }
  console.error('\nPlease check:');
  console.error('1. Variable names: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_AUTH_TOKEN (or CLOUDFLARE_API_TOKEN)');
  console.error('2. No extra spaces around the = sign');
  console.error('3. Values are not empty');
  console.error('4. If values contain spaces, they should be wrapped in quotes');
  console.error('\nExample format:');
  console.error('CLOUDFLARE_ACCOUNT_ID=your_account_id');
  console.error('CLOUDFLARE_AUTH_TOKEN=your_auth_token');
  console.error('  OR');
  console.error('CLOUDFLARE_API_TOKEN=your_auth_token');
  process.exit(1);
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function testCloudflareAI() {
  const messages: ChatMessage[] = [
    { 
      role: 'system', 
      content: 'You are a helpful assistant.' 
    },
    { 
      role: 'user', 
      content: 'Hello, how are you? Please respond briefly.' 
    }
  ];

  try {
    // TypeScript guard: we already checked these exist above
    if (!accountId || !authToken) {
      throw new Error('Missing required credentials');
    }

    console.log('🧪 Testing Cloudflare AI API...\n');
    console.log('📋 Configuration:');
    console.log(`   Account ID: ${accountId.substring(0, 10)}...${accountId.substring(accountId.length - 4)}`);
    console.log(`   Auth Token: ${authToken.substring(0, 10)}...${authToken.substring(authToken.length - 4)}`);
    console.log(`   Model: @cf/meta/llama-2-7b-chat-int8`);
    console.log(`   Messages: ${messages.length}`);
    console.log('\n📤 Request payload:');
    console.log(JSON.stringify({ messages }, null, 2));
    console.log('\n⏳ Sending request to Cloudflare...\n');

    const startTime = Date.now();
    
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

    const duration = Date.now() - startTime;

    console.log('📥 Response received:');
    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));
    console.log('\n');

    if (!response.ok) {
      console.error('❌ API call failed!\n');
      const errorText = await response.text();
      console.error('Error response body:');
      try {
        const errorJson = JSON.parse(errorText);
        console.error(JSON.stringify(errorJson, null, 2));
      } catch {
        console.error(errorText);
      }
      process.exit(1);
    }

    // Try to parse response
    const contentType = response.headers.get('content-type') || '';
    console.log(`📄 Content-Type: ${contentType}\n`);

    if (contentType.includes('application/json')) {
      const data = await response.json();
      console.log('✅ Response (JSON):');
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
        } else if (data.result.text) {
          message = data.result.text;
        } else if (data.result.message) {
          message = data.result.message;
        } else if (typeof data.result === 'object') {
          message = JSON.stringify(data.result);
        }
      } else if (data.text) {
        message = data.text;
      } else if (data.message) {
        message = data.message;
      } else {
        const stringValues = Object.values(data).filter(v => typeof v === 'string');
        if (stringValues.length > 0) {
          message = stringValues[0] as string;
        } else {
          message = JSON.stringify(data);
        }
      }

      if (message) {
        console.log('✨ Extracted message:');
        console.log(`   "${message}"\n`);
        console.log('✅ Test passed! API is working correctly.\n');
      } else {
        console.log('⚠️  Could not extract message from response');
        console.log('Response structure:', Object.keys(data));
        console.log('\n⚠️  Test completed but message extraction failed.\n');
      }
    } else {
      const text = await response.text();
      console.log('✅ Response (text):');
      console.log(`   "${text}"\n`);
      console.log('✅ Test passed! API is working correctly.\n');
    }

  } catch (error) {
    console.error('❌ Error occurred:');
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
      console.error(`   ${error.stack}\n`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// Run the test
testCloudflareAI().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
