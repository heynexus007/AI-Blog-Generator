# AI Blog Generator - Troubleshooting Guide

## Quick Start Instructions

### 1. Prerequisites
- **Node.js** (version 14 or higher) - Download from https://nodejs.org/
- **npm** (comes with Node.js)

### 2. Installation Steps
```bash
# Navigate to project directory
cd "c:\MyWorkspace\Gen AI Projects\AI_Blog_Generator_final"

# Install dependencies
npm install

# Start the server
npm start
```

### 3. Access the Application
- Open your browser
- Go to: **http://localhost:3000**

## Credentials & Configuration

### API Key (Already Configured)
- **Nebius API Key**: Already set in `server/.env`
- **Port**: 3000 (default)
- **Fallback**: If API fails, mock content will be used

### Environment Variables
```
NEBIUS_API_KEY=eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnaXRodWJ8MTY4NzA5NzAwIiwic2NvcGUiOiJvcGVuaWQgb2ZmbGluZV9hY2Nlc3MiLCJpc3MiOiJhcGlfa2V5X2lzc3VlciIsImF1ZCI6WyJodHRwczovL25lYml1cy1pbmZlcmVuY2UuZXUuYXV0aDAuY29tL2FwaS92Mi8iXSwiZXhwIjoxOTE4MTgzOTI0LCJ1dWlkIjoiMDE5OWU2MzYtMDI0Zi03ZTExLTg3YzctZDdkYmFhOWRkNGY2IiwibmFtZSI6IkFJIEdlbmVyYXRvciB0ZXh0IDEiLCJleHBpcmVzX2F0IjoiMjAzMC0xMC0xNFQwNDo1MjowNCswMDAwIn0.yL9EroxZSMChxy22LtVgp75iXVQIkkaCKxm_UI0HWhE
PORT=3000
```

## Common Issues & Solutions

### Issue 1: "npm not found" or "node not found"
**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your command prompt/terminal
3. Verify installation: `node --version` and `npm --version`

### Issue 2: Server won't start
**Solution:**
1. Check if port 3000 is already in use
2. Try a different port: `PORT=3001 npm start`
3. Check for missing dependencies: `npm install`

### Issue 3: Page loads but doesn't work
**Solution:**
1. Open browser developer tools (F12)
2. Check Console tab for JavaScript errors
3. Check Network tab for failed requests
4. Try the test page: `http://localhost:3000/test.html`

### Issue 4: "Cannot generate blog content"
**Solution:**
1. Check internet connection
2. API key is already configured, so this should work
3. The app will use fallback content if API fails
4. Check server console for error messages

### Issue 5: Blank page or 404 error
**Solution:**
1. Ensure server is running (check console output)
2. Verify URL: `http://localhost:3000` (not https)
3. Check if all files are present in client/ folder

## Testing Steps

### 1. Test Server Connection
```bash
# In browser, go to:
http://localhost:3000/health
# Should return: {"status":"OK","timestamp":"..."}
```

### 2. Test Main Application
```bash
# In browser, go to:
http://localhost:3000
# Should show the AI Blog Generator interface
```

### 3. Test Blog Generation
1. Enter keywords: "artificial intelligence"
2. Select tone: "Casual"
3. Select length: "Short"
4. Click "Generate Blog Post"
5. Should display generated content

### 4. Use Test Page
```bash
# In browser, go to:
http://localhost:3000/test.html
# Automated testing interface
```

## Alternative Startup Methods

### Method 1: Direct Node.js
```bash
node server/index.js
```

### Method 2: Using start.js (with diagnostics)
```bash
node start.js
```

### Method 3: Test server (port 3001)
```bash
node test-server.js
```

## File Structure Verification
Ensure these files exist:
```
AI_Blog_Generator_final/
├── client/
│   ├── index.html ✓
│   ├── script.js ✓
│   └── style.css ✓
├── server/
│   ├── index.js ✓
│   └── .env ✓
├── package.json ✓
└── node_modules/ (after npm install)
```

## Support Information
- **Localhost URL**: http://localhost:3000
- **Test URL**: http://localhost:3000/test.html
- **Health Check**: http://localhost:3000/health
- **API**: Nebius AI (configured)
- **Fallback**: Mock content available

## Console Output (Expected)
When server starts successfully, you should see:
```
🚀 AI Blog Generator server running on http://localhost:3000
📝 Open your browser and navigate to http://localhost:3000
✅ Nebius API key configured
```