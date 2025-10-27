# Docker & Kubernetes Deployment Guide

## Docker Hub Deployment

### 1. Build and Push to Docker Hub
```bash
# Build the image
docker build -t your-dockerhub-username/ai-blog-generator:latest .

# Login to Docker Hub
docker login

# Push to Docker Hub
docker push your-dockerhub-username/ai-blog-generator:latest
```

### 2. Run Locally with Docker
```bash
# Run the container
docker run -p 3000:3000 your-dockerhub-username/ai-blog-generator:latest

# Access at http://localhost:3000
```

## Kubernetes Deployment

### 1. Update Image Name
Edit `k8s/deployment.yaml` and replace `your-dockerhub-username` with your actual Docker Hub username.

### 2. Deploy to Kubernetes
```bash
# Apply all manifests
kubectl apply -k k8s/

# Or apply individually
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa.yaml
```

### 3. Check Deployment Status
```bash
# Check pods
kubectl get pods -n ai-blog-generator

# Check service
kubectl get svc -n ai-blog-generator

# Check ingress
kubectl get ingress -n ai-blog-generator
```

### 4. Access Application
```bash
# Port forward for local access
kubectl port-forward -n ai-blog-generator svc/ai-blog-generator-service 3000:80

# Access at http://localhost:3000
```

## Files Created

### Docker Files:
- `Dockerfile` - Multi-stage build with Node.js Alpine
- `.dockerignore` - Excludes unnecessary files

### Kubernetes Files:
- `k8s/namespace.yaml` - Application namespace
- `k8s/secret.yaml` - API key secret
- `k8s/configmap.yaml` - Environment configuration
- `k8s/deployment.yaml` - Application deployment
- `k8s/service.yaml` - Service exposure
- `k8s/ingress.yaml` - External access
- `k8s/hpa.yaml` - Auto-scaling
- `k8s/kustomization.yaml` - Resource management

## Configuration Notes

- **Replicas**: 2 (minimum), scales up to 10
- **Resources**: 128Mi-256Mi memory, 100m-200m CPU
- **Health Checks**: Liveness and readiness probes
- **Auto-scaling**: Based on 70% CPU utilization
- **API Key**: Stored as Kubernetes secret