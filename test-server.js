const http = require('http');

// Simple test server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <html>
            <body>
                <h1>Server Test - Working!</h1>
                <p>If you see this, Node.js is working correctly.</p>
                <p>Time: ${new Date().toISOString()}</p>
                <a href="/">Go to AI Blog Generator</a>
            </body>
        </html>
    `);
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});