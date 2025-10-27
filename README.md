# AI-Powered Blog Generator

## Project Overview
A web application that generates blog content using Nebius AI based on user-specified keywords, tone, and length preferences.

## Features
- **AI Content Generation**: Uses Nebius AI (Meta-Llama-3.1-70B-Instruct model)
- **Multiple Tones**: Casual, Formal, Professional, Friendly
- **Variable Lengths**: Short (150-200 words), Medium (300-400 words), Long (500-600 words)
- **Fallback System**: Mock content when AI API is unavailable
- **Responsive Design**: Works on desktop and mobile devices
- **Copy to Clipboard**: Easy content sharing

## Installation

1. **Clone/Download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   - Create `.env` file in server directory
   - Add your Nebius API key: `NEBIUS_API_KEY=your_key_here`

4. **Run the application**:
   ```bash
   npm start
   ```
5. **Open browser**: Navigate to `http://localhost:3000`

## Project Structure
```
ai-blog-generator/
├── client/
│   ├── index.html      # User interface
│   ├── style.css       # Styling
│   └── script.js       # Frontend logic
├── server/
│   ├── index.js        # Express server + AI integration
│   └── .env           # Environment variables
├── screenshots/        # Project screenshots
├── package.json       # Dependencies
└── README.md          # Documentation
```

## API Endpoints
- `POST /generate` - Generate blog content
- `GET /health` - Health check
- `GET /` - Serve main page

## Technologies Used
- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript
- **AI Service**: Nebius AI (Meta-Llama-3.1-70B-Instruct)
- **Styling**: CSS Grid, Flexbox, Responsive Design