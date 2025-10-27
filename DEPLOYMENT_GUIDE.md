# Easy Deployment Guide

## Docker Compose Deployment

### 1. Quick Start
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your API key
# NEBIUS_API_KEY=your_actual_api_key

# Start the application
docker-compose up -d

# Access at http://localhost:3000
```

### 2. Management Commands
```bash
# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

## Jenkins CI/CD Setup

### 1. Prerequisites
- Jenkins with Docker plugin
- Docker Hub credentials configured in Jenkins as 'docker-hub-credentials'

### 2. Create Jenkins Job
1. New Item → Pipeline
2. Pipeline → Pipeline script from SCM
3. SCM → Git → Repository URL
4. Script Path: `Jenkinsfile`

### 3. Required Jenkins Credentials
- `docker-hub-credentials` - Docker Hub username/password

### 4. Pipeline Stages
- **Checkout** - Get source code
- **Build** - Create Docker image
- **Test** - Run tests (optional)
- **Push** - Upload to Docker Hub
- **Deploy** - Start with docker-compose

## Manual Deployment Options

### Option 1: Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Option 2: Direct Docker
```bash
docker build -t ai-blog-generator .
docker run -p 3000:3000 -e NEBIUS_API_KEY=your_key ai-blog-generator
```

### Option 3: Node.js
```bash
npm install
npm start
```

## Environment Variables
- `NEBIUS_API_KEY` - Your Nebius AI API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (default: production)