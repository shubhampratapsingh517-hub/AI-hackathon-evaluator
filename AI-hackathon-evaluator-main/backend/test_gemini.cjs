const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: './.env' });

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // Models seen in screenshot
    const models = [
        'gemini-3-flash-preview', 
        'gemini-3.1-flash-lite-preview', 
        'gemini-3.1-pro-preview',
        'gemini-2.0-flash'
    ];
    
    for (const m of models) {
        try {
            console.log(`Testing ${m}...`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent('Hi');
            console.log(`Success with ${m}:`, (await result.response).text());
            return;
        } catch (e) {
            console.error(`Failed with ${m}:`, e.message);
        }
    }
  } catch (err) {
    console.error('Fatal error:', err.message);
  }
}

listModels();
