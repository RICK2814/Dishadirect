# AI Setup Instructions for DishaDirect

## Google AI API Configuration

To enable AI-powered career guidance features, you need to set up a Google AI API key:

### 1. Get Your API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
1. Open the `.env.local` file in your project root
2. Replace `your_google_ai_api_key_here` with your actual API key:
   ```
   GOOGLE_GENAI_API_KEY=your_actual_api_key_here
   ```

### 3. Start the Development Server
```bash
npm run dev
```

### 4. Test AI Features
1. Open your browser to `http://localhost:9002`
2. Fill out the skills and interests form
3. Click "Get Career Insights" to test the AI functionality

## Troubleshooting

### Common Issues:
- **"AI is not fetching"**: Check if your API key is correctly set in `.env.local`
- **"Failed to fetch AI-powered insights"**: Verify your API key is valid and has quota remaining
- **TypeScript errors**: Run `npm install` to ensure all dependencies are installed

### API Key Security:
- Never commit your `.env.local` file to version control
- The `.gitignore` file already excludes `.env.local`
- Consider using different API keys for development and production

## Features That Use AI:
- Career Path Recommendations
- Job Market Trends Analysis
- Skills Gap Analysis
- Skills Recommendations
- Interview Preparation Tips
