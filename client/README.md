# AI Meeting Notes Summarizer - Client

This is the frontend React application for the AI-powered meeting notes summarizer.

## Features

- **📝 AI Summary Generation**: Upload text and generate intelligent summaries using Google's AI
- **✏️ Custom Prompts**: Specify custom instructions for how you want your summary formatted
- **📚 Summary Management**: View, edit, and manage all your generated summaries
- **📧 Email Sharing**: Share summaries via email with custom messages
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🔄 Real-time Updates**: Automatic refresh and state management

## Prerequisites

- Node.js (v18 or higher)
- Backend server running on `http://localhost:5000`

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UploadForm.tsx  # AI summary generation form
│   ├── SummaryList.tsx # List of all summaries
│   ├── SummaryEditor.tsx # Edit summary component
│   └── ShareForm.tsx   # Email sharing form
├── pages/              # Page components
│   ├── Home.tsx        # Main dashboard
│   └── editor.tsx      # Summary editor page
├── App.tsx             # Main app component with routing
└── main.tsx            # App entry point
```

## Component Overview

### UploadForm
- Text input for meeting transcripts
- Custom prompt input for AI instructions
- File naming and organization
- Real-time validation and error handling

### SummaryList
- Displays all generated summaries
- Quick actions (view, edit)
- Search and filtering capabilities
- Responsive grid layout

### SummaryEditor
- Full-featured text editor
- Save and reset functionality
- Real-time preview
- Navigation back to home

### ShareForm
- Email recipient input
- Summary selection dropdown
- Custom message support
- Email validation

## Technologies Used

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Fast build tool and dev server

## API Integration

The client communicates with the backend server at `http://localhost:5000`:

- `POST /api/summary/upload` - Generate new summary
- `GET /api/summary` - Fetch all summaries
- `PUT /api/summary/update` - Update existing summary
- `POST /api/summary/share` - Share summary via email

## Development

### Adding New Components
1. Create component in `src/components/`
2. Export with proper TypeScript interfaces
3. Import and use in pages

### Styling
- Use Tailwind CSS utility classes
- Follow responsive design principles
- Maintain consistent spacing and colors

### State Management
- Use React hooks for local state
- Pass data through props
- Use context for global state if needed

## Building for Production

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Preview the build:**
   ```bash
   npm run preview
   ```

3. **Deploy the `dist/` folder** to your hosting service

## Troubleshooting

### Common Issues

1. **Backend Connection Errors:**
   - Ensure backend server is running on port 5000
   - Check CORS configuration
   - Verify API endpoints

2. **Build Errors:**
   - Clear `node_modules` and reinstall
   - Check TypeScript configuration
   - Verify all dependencies are installed

3. **Styling Issues:**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration
   - Verify CSS imports

## Contributing

1. Follow TypeScript best practices
2. Use meaningful component and variable names
3. Add proper error handling
4. Test components thoroughly
5. Maintain responsive design

## License

ISC
