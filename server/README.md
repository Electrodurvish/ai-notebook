# AI Meeting Notes Summarizer - Server

This is the backend server for the AI-powered meeting notes summarizer application.

## Features

- **AI-Powered Summarization**: Uses Google's Generative AI (Gemini Pro) to create intelligent summaries
- **Custom Prompts**: Support for custom instructions (e.g., "Summarize in bullet points for executives")
- **Editable Summaries**: Summaries can be edited after generation
- **Email Sharing**: Share summaries via email with custom messages
- **MongoDB Storage**: Persistent storage for all summaries and metadata
- **RESTful API**: Clean API endpoints for all operations

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google AI API key
- Gmail account for email functionality

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   Create a `.env` file in the server root directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   
   # MongoDB Connection
   MONGO_URI=mongodb://localhost:27017/ai-notes-app
   
   # Email Configuration (Gmail)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Google AI API Key
   GOOGLE_AI_API_KEY=your-google-ai-api-key
   ```

3. **MongoDB Setup:**
   - Install MongoDB locally or use MongoDB Atlas
   - Create a database named `ai-notes-app`
   - Update the `MONGO_URI` in your `.env` file

4. **Google AI API Setup:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add it to your `.env` file

5. **Gmail Setup:**
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password
   - Use the app password in your `.env` file

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## API Endpoints

### POST `/api/summary/upload`
Upload text and generate AI summary.

**Request Body:**
```json
{
  "text": "Your meeting transcript text here...",
  "filename": "Meeting_2024_01_15",
  "customPrompt": "Summarize in bullet points for executives"
}
```

**Response:**
```json
{
  "success": true,
  "summary": {
    "_id": "...",
    "filename": "Meeting_2024_01_15",
    "summary": "AI generated summary...",
    "originalText": "Original text...",
    "customPrompt": "Custom prompt...",
    "createdAt": "2024-01-15T10:00:00.000Z"
  },
  "message": "Summary generated successfully!"
}
```

### GET `/api/summary`
Get all summaries.

**Response:**
```json
{
  "success": true,
  "summaries": [...],
  "count": 5
}
```

### PUT `/api/summary/update`
Update an existing summary.

**Request Body:**
```json
{
  "summaryId": "summary_id_here",
  "updatedSummary": "Updated summary text..."
}
```

### POST `/api/summary/share`
Share a summary via email.

**Request Body:**
```json
{
  "email": "recipient@example.com",
  "summaryId": "summary_id_here",
  "customMessage": "Here's the summary you requested:"
}
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Development

- **TypeScript**: Full TypeScript support with strict type checking
- **Hot Reload**: Development server automatically restarts on file changes
- **ESLint**: Code quality and consistency
- **MongoDB**: Mongoose ODM for database operations

## Troubleshooting

1. **MongoDB Connection Issues:**
   - Ensure MongoDB is running
   - Check your connection string
   - Verify network access if using cloud MongoDB

2. **Email Sending Issues:**
   - Verify Gmail credentials
   - Check if 2FA is enabled
   - Ensure app password is correct

3. **AI API Issues:**
   - Verify Google AI API key is valid
   - Check API quota and billing
   - Ensure the API is enabled in Google Cloud Console

## License

ISC

