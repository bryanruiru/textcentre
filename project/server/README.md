# TextCentre AI Service

This service provides AI functionality for the TextCentre application, including:
- AI-powered book recommendations
- AI chat assistant for book-related questions

## Setup Instructions

### Prerequisites
- Node.js 14+ and npm
- Supabase account with the TextCentre database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the server directory with the following variables:
```
PORT=3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up the database schema:
   - Run the SQL commands in `schema.sql` in your Supabase SQL editor

### Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### AI Chat
`POST /chat`
- Requires authentication token in Authorization header
- Requires premium user status
- Request body: `{ "message": "user message", "context": { ... } }`
- Response: `{ "id": "message_id", "message": "AI response" }`

### AI Recommendations
`POST /recommendations`
- Requires authentication token in Authorization header
- Requires premium user status
- Request body: `{ "limit": 5, "genre": "optional_genre" }`
- Response: `{ "recommendations": [ ... book objects ... ] }`

## Integration with Frontend

The frontend communicates with this service through the `aiService.ts` file in the `src/services` directory. The service endpoints should be configured in your environment variables:

```
VITE_API_URL=http://localhost:3000
VITE_AI_API_URL=http://localhost:3001
```

## Production Deployment

For production, this service should be deployed to a server that can handle the AI processing requirements. Consider using:
- AWS Lambda or EC2
- Google Cloud Functions or App Engine
- Heroku

In a real production environment, this service would connect to an actual AI model API such as:
- OpenAI API
- Cohere
- Hugging Face
- Google Vertex AI

## Future Enhancements

1. Connect to a real NLP model for more intelligent chat responses
2. Implement a collaborative filtering recommendation algorithm
3. Add content-based recommendation features
4. Implement user feedback loop for improving AI responses
5. Add sentiment analysis for book reviews
