# 24hr Story

A modern social media platform for sharing and discovering stories that expire after 24 hours.

## 🚀 Features

- Real-time story creation and sharing
- 24-hour story expiration
- Social media integration
- Real-time notifications
- User authentication and profiles
- Like and comment system
- Trending stories
- Dark mode support
- Analytics and monitoring
- Mobile-responsive design

## 🛠 Tech Stack

### Frontend
- React.js
- Redux for state management
- Styled Components for styling
- Axios for API requests
- WebSocket for real-time features

### Backend Services
- Node.js/Express
- Redis for caching
- RabbitMQ for message queuing
- MinIO for file storage
- MongoDB for database

### Infrastructure
- Docker for containerization
- Kubernetes for orchestration
- Helm for deployment
- GitLab CI/CD for automation
- Prometheus & Grafana for monitoring
- ELK Stack for logging
- SonarQube for code quality

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Kubernetes cluster
- GitLab account
- Slack workspace (for notifications)

## 🚀 Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://gitlab.com/your-username/24hr-story.git
cd 24hr-story
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

### Docker Development

1. Generate package-lock.json (if not exists):
```bash
npm install
```

2. Build and start containers:
```bash
docker compose up --build
```

3. Access the application at `http://localhost:3000`

#### Troubleshooting Docker Build

If you encounter build issues:

1. **Missing package-lock.json**
   ```bash
   npm install  # This will generate package-lock.json
   ```

2. **Permission Issues**
   ```bash
   # On Linux/Mac
   sudo chown -R $USER:$USER .
   ```

3. **Clean Docker Cache**
   ```bash
   docker compose down
   docker system prune -a
   ```

4. **Verify Docker Configuration**
   ```bash
   docker compose config
   ```

## 🏗 Infrastructure Setup

### Kubernetes Cluster

1. Create namespaces:
```bash
kubectl create namespace 24hr-story-prod
kubectl create namespace 24hr-story-stage
kubectl create namespace 24hr-story-dev
```

2. Install Helm dependencies:
```bash
cd helm/24hr-story
helm dependency update
```

3. Deploy the application:
```bash
helm upgrade --install 24hr-story . \
  --namespace 24hr-story-dev \
  --set environment=development
```

### Monitoring Stack

1. Install Prometheus & Grafana:
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack
```

2. Install ELK Stack:
```bash
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch
helm install kibana elastic/kibana
helm install logstash elastic/logstash
```

## 🔄 CI/CD Pipeline

The project uses GitLab CI/CD with the following stages:

1. **Code Quality**
   - Linting
   - Code formatting
   - SonarQube analysis

2. **Build**
   - Docker image building
   - Image tagging
   - Registry push

3. **Test**
   - Unit tests
   - Integration tests
   - E2E tests

4. **Security**
   - Container scanning
   - Dependency scanning
   - Vulnerability checks

5. **Deploy**
   - Helm deployment
   - Environment-specific configurations
   - Slack notifications

### Pipeline Configuration

Required GitLab variables:
- `CI_REGISTRY_USER`
- `CI_REGISTRY_PASSWORD`
- `KUBE_CONFIG`
- `SONAR_TOKEN`
- `SLACK_WEBHOOK_URL`

## 📊 Monitoring & Logging

### Prometheus & Grafana
- CPU/Memory usage
- Request rates
- Error rates
- Response times
- Custom metrics

### ELK Stack
- Application logs
- Error tracking
- Performance monitoring
- User activity logs

### SonarQube
- Code quality metrics
- Code coverage
- Security vulnerabilities
- Code smells

## 🔒 Security

- Container security scanning
- Dependency vulnerability checks
- SSL/TLS encryption
- Authentication & Authorization
- Rate limiting
- Input validation

## 📱 Social Media Integration

Supported platforms:
- Facebook
- Twitter
- LinkedIn
- WhatsApp
- Reddit
- Pinterest
- Telegram
- Tumblr

## 🔄 Service Architecture

### Core Services
- Story Service
- User Service
- API Service
- Utility Service

### Infrastructure Services
- Cache Service (Redis)
- Storage Service (MinIO)
- Notification Service (RabbitMQ)
- Logger Service
- Analytics Service
- Social Service

## 📈 Analytics

- User engagement metrics
- Story performance
- Social sharing statistics
- Platform usage patterns
- Error tracking
- Performance monitoring

## 🔧 Development Tools

- ESLint for code linting
- Prettier for code formatting
- Jest for testing
- Cypress for E2E testing
- Husky for git hooks
- Commitlint for commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

