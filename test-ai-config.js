// Simple test script to verify AI configuration
require('dotenv').config({ path: '.env.local' });

const { genkit } = require('genkit');
const { googleAI } = require('@genkit-ai/googleai');

async function testAI() {
  try {
    console.log('Testing AI configuration...');

    const apiKey = process.env.GOOGLE_GENAI_API_KEY;
    if (!apiKey || apiKey === 'your_google_ai_api_key_here') {
      console.error('❌ GOOGLE_GENAI_API_KEY not set or using placeholder value');
      console.log('Please update .env.local with your actual API key');
      return;
    }

    console.log('✅ API key found');

    const ai = genkit({
      plugins: [googleAI({ apiKey })],
      model: 'googleai/gemini-2.5-flash',
    });

    const prompt = ai.definePrompt({
      name: 'testPrompt',
      prompt: 'Say "Hello, AI is working!" in a friendly way.',
    });

    const { output } = await prompt();
    console.log('✅ AI Response:', output);
    console.log('🎉 AI configuration is working correctly!');

  } catch (error) {
    console.error('❌ AI configuration error:', error.message);
    console.log('Please check your API key and internet connection');
  }
}

testAI();
