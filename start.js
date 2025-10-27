const fs = require('fs');
const path = require('path');

console.log('🔍 AI Blog Generator - Startup Diagnostics');
console.log('==========================================');

// Check if all required files exist
const requiredFiles = [
    'server/index.js',
    'client/index.html',
    'client/script.js',
    'client/style.css',
    'server/.env'
];

console.log('\n📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

// Check environment variables
console.log('\n🔑 Checking environment configuration...');
require('dotenv').config({ path: path.join(__dirname, 'server', '.env') });

const hasApiKey = process.env.NEBIUS_API_KEY && process.env.NEBIUS_API_KEY !== 'your_nebius_api_key_here';
console.log(`   ${hasApiKey ? '✅' : '⚠️'} Nebius API Key: ${hasApiKey ? 'Configured' : 'Not configured (will use fallback)'}`);
console.log(`   ✅ Port: ${process.env.PORT || 3000}`);

// Check package.json
console.log('\n📦 Checking dependencies...');
try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    const deps = Object.keys(packageJson.dependencies || {});
    console.log(`   ✅ Dependencies found: ${deps.join(', ')}`);
} catch (error) {
    console.log('   ❌ Error reading package.json');
}

console.log('\n🚀 Starting server...');
console.log('==========================================');

if (allFilesExist) {
    // Start the main server
    require('./server/index.js');
} else {
    console.log('❌ Cannot start server - missing required files');
    process.exit(1);
}