# How to Run the AI Blog Generator

## Prerequisites
You need Node.js installed on your system. Download from: https://nodejs.org/

## Quick Start

### Method 1: Full Application (Recommended)
```bash
# Open Command Prompt in project directory
cd "c:\MyWorkspace\Gen AI Projects\AI_Blog_Generator_final"

# Install dependencies
npm install

# Start the server
npm start
```

### Method 2: Simple Mode (No Dependencies)
```bash
# Run the simple server
node run-simple.js
```

### Method 3: Docker (If Docker is installed)
```bash
# Build and run with Docker
docker build -t ai-blog-generator .
docker run -p 3000:3000 ai-blog-generator
```

### Method 4: Docker Compose
```bash
# Copy environment file
copy .env.example .env

# Start with docker-compose
docker-compose up -d
```

## Access the Application
Once running, open your browser and go to:
**http://localhost:3000**

## Features Available
- ✅ Blog content generation (AI + fallback)
- ✅ Multiple tones and lengths
- ✅ Copy to clipboard
- ✅ PDF generation (browser print dialog)
- ✅ Responsive design

## Troubleshooting
1. **Node.js not found**: Install Node.js from nodejs.org
2. **Port 3000 in use**: Change PORT in .env file
3. **Dependencies missing**: Run `npm install`
4. **PDF not working**: Uses browser print dialog as fallback

## API Endpoints
- `GET /` - Main application
- `POST /generate` - Generate blog content
- `POST /generate-pdf` - Generate PDF
- `GET /health` - Health check

## Environment Variables
- `NEBIUS_API_KEY` - Already configured
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode