# Run on localhost:3000

## Quick Setup

1. **Install Node.js** from https://nodejs.org/ if not installed
2. **Open Command Prompt** in project folder
3. **Run one of these commands:**

### Option 1: Minimal Server (No dependencies)
```cmd
node server-minimal.js
```

### Option 2: Full Server (Requires npm install first)
```cmd
npm install
node server/index.js
```

### Option 3: Using npm start
```cmd
npm install
npm start
```

## Access Application
Open browser: **http://localhost:3000**

## If Port 3000 is Busy
```cmd
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

## Files Created for localhost:3000
- `server-minimal.js` - Simple server without dependencies
- `start-server.bat` - Windows batch file to start server

## Common Errors & Solutions
- **Node not found**: Install Node.js
- **Port in use**: Kill process or use different port
- **Module not found**: Run `npm install` first
- **Permission denied**: Run as administrator

## Test Server is Working
Visit: http://localhost:3000/health
Should return: {"status":"OK"}