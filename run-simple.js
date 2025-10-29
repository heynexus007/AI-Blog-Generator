// Simple server runner without external dependencies
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// Mock blog content
const mockBlogs = {
  casual: {
    short: "Hey there! Let's dive into {keywords}. It's pretty cool stuff that everyone should know about. The basics are simple - just think of it as your everyday solution to common problems. Whether you're a beginner or just curious, this topic has something for everyone. Keep exploring and you'll discover amazing things!"
  }
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (pathname === '/') {
    // Serve main HTML
    try {
      const html = fs.readFileSync(path.join(__dirname, 'client', 'index.html'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(404);
      res.end('File not found');
    }
  } else if (pathname === '/style.css') {
    try {
      const css = fs.readFileSync(path.join(__dirname, 'client', 'style.css'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
    } catch (error) {
      res.writeHead(404);
      res.end('File not found');
    }
  } else if (pathname === '/script.js') {
    try {
      const js = fs.readFileSync(path.join(__dirname, 'client', 'script.js'), 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(js);
    } catch (error) {
      res.writeHead(404);
      res.end('File not found');
    }
  } else if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK', timestamp: new Date().toISOString() }));
  } else if (pathname === '/generate' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { keywords, tone, length } = data;
        
        const content = mockBlogs.casual.short.replace('{keywords}', keywords || 'your topic');
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          content: content,
          metadata: { keywords, tone, length, generatedAt: new Date().toISOString() }
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (pathname === '/generate-pdf' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { content, metadata } = data;
        
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Blog Post</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
              .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .meta { color: #666; font-size: 14px; }
              .content { font-size: 16px; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="title">AI Generated Blog Post</div>
              <div class="meta">
                Keywords: ${metadata?.keywords || 'N/A'} | 
                Tone: ${metadata?.tone || 'N/A'} | 
                Length: ${metadata?.length || 'N/A'}
              </div>
            </div>
            <div class="content">${content.replace(/\n/g, '<br>')}</div>
          </body>
          </html>
        `;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ html, fallback: true }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`🚀 AI Blog Generator server running on http://localhost:${PORT}`);
  console.log(`📝 Open your browser and navigate to http://localhost:${PORT}`);
  console.log('⚠️  Running in simple mode - using mock content only');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.log('❌ Server error:', error.message);
  }
});