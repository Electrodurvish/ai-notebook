# 🤖 AI Meeting Notes Summarizer

A full-stack application that uses AI to generate intelligent summaries from meeting transcripts, with custom prompts, editing capabilities, and email sharing.

## ✨ Features

- **🧠 AI-Powered Summarization**: Uses Google's Generative AI (Gemini Pro) for intelligent summaries
- **✏️ Custom Prompts**: Specify custom instructions (e.g., "Summarize in bullet points for executives")
- **📝 Editable Summaries**: Edit and refine AI-generated summaries
- **📧 Email Sharing**: Share summaries via email with custom messages
- **📚 Summary Management**: View, organize, and manage all your summaries
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🔄 Real-time Updates**: Automatic refresh and state management

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript + MongoDB
- **Frontend**: React 19 + TypeScript + Tailwind CSS + Vite
- **AI**: Google Generative AI (Gemini Pro)
- **Database**: MongoDB with Mongoose ODM
- **Email**: Nodemailer with Gmail integration

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Google AI API key
- Gmail account for email functionality

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd ai-notes-app
```

### 2. Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create .env file with your configuration
# (See server/.env.example for template)

# Start development server
npm run dev
```

**Environment Variables (.env):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-notes-app
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### 3. Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Open Your Browser

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## 📁 Project Structure

```
ai-notes-app/
├── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/   # API endpoints logic
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── config/        # Database configuration
│   └── package.json
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Summary Management
- `POST /api/summary/upload` - Generate new AI summary
- `GET /api/summary` - Fetch all summaries
- `PUT /api/summary/update` - Update existing summary
- `POST /api/summary/share` - Share summary via email

## 🎯 How It Works

1. **Upload Text**: Paste your meeting transcript or notes
2. **Custom Instructions**: Add specific prompts (optional)
3. **AI Generation**: Google AI creates intelligent summary
4. **Edit & Refine**: Modify the summary as needed
5. **Save & Share**: Save changes and share via email

## 🛠️ Development

### Backend Commands
```bash
cd server
npm run dev      # Development with hot reload
npm run build    # Build for production
npm start        # Start production server
```

### Frontend Commands
```bash
cd client
npm run dev      # Development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔑 API Keys Setup

### Google AI API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add to your `.env` file

### Gmail Setup
1. Enable 2-factor authentication
2. Generate an app password
3. Use app password in `.env` file

### MongoDB
1. Install locally or use MongoDB Atlas
2. Create database `ai-notes-app`
3. Update connection string in `.env`

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string format
   - Ensure network access

2. **AI API Errors**
   - Verify API key is valid
   - Check API quota and billing
   - Ensure API is enabled

3. **Email Sending Issues**
   - Verify Gmail credentials
   - Check 2FA is enabled
   - Use app password, not regular password

4. **Frontend Build Errors**
   - Clear `node_modules` and reinstall
   - Check TypeScript configuration
   - Verify Tailwind CSS setup

## 📱 Features in Detail

### AI Summary Generation
- Supports long-form text input
- Custom instruction prompts
- Intelligent context understanding
- Fallback to basic summary if AI fails

### Summary Editing
- Full-featured text editor
- Real-time preview
- Save and reset functionality
- Change tracking

### Email Sharing
- Multiple recipient support
- Custom message attachments
- Professional email formatting
- Delivery confirmation

### User Experience
- Responsive design
- Loading states and feedback
- Error handling and validation
- Intuitive navigation

## 🚀 Deployment

### Backend Deployment
1. Build the project: `npm run build`
2. Deploy `dist/` folder to your server
3. Set environment variables
4. Start with: `npm start`

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy `dist/` folder to your hosting service
3. Update API endpoints if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

ISC License - see LICENSE file for details

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section
2. Review the component READMEs
3. Check the console for error messages
4. Verify all dependencies are installed

---

**Happy Summarizing! 🎉**

