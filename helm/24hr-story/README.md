# 24hr-Story Helm Chart

This Helm chart deploys the 24hr-Story application along with its monitoring, logging, and service mesh stack on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.2.0+
- PV provisioner support in the underlying infrastructure
- Docker registry access for the application image

## Installing the Chart

Add the required Helm repositories:

```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo add elastic https://helm.elastic.co
helm repo add sonarqube https://SonarSource.github.io/helm-chart-sonarqube
helm repo add hashicorp https://helm.releases.hashicorp.com
helm repo update
```

Install the chart:

```bash
helm install 24hr-story ./helm/24hr-story
```

## Configuration

The following table lists the configurable parameters of the chart and their default values.

### Application Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `app.replicaCount` | Number of application replicas | `2` |
| `app.image.repository` | Application image repository | `your-registry/24hr-story` |
| `app.image.tag` | Application image tag | `latest` |
| `app.service.type` | Kubernetes service type | `ClusterIP` |
| `app.service.port` | Kubernetes service port | `80` |

### Consul Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `consul.enabled` | Enable Consul | `true` |
| `consul.server.replicas` | Number of Consul server replicas | `3` |
| `consul.client.enabled` | Enable Consul client | `true` |
| `consul.ui.enabled` | Enable Consul UI | `true` |
| `consul.connectInject.enabled` | Enable Consul Connect injection | `true` |

### Monitoring Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `prometheus.enabled` | Enable Prometheus | `true` |
| `grafana.enabled` | Enable Grafana | `true` |
| `grafana.adminPassword` | Grafana admin password | `admin` |

### Logging Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `elasticsearch.enabled` | Enable Elasticsearch | `true` |
| `kibana.enabled` | Enable Kibana | `true` |
| `logstash.enabled` | Enable Logstash | `true` |

### Code Quality Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `sonarqube.enabled` | Enable SonarQube | `true` |
| `sonarqube.postgresql.enabled` | Enable PostgreSQL for SonarQube | `true` |

## Service Mesh Features

The chart includes Consul service mesh with the following features:

- Service discovery and registration
- Health checking
- Service segmentation
- mTLS encryption
- Traffic management
- Observability integration

## Persistence

The chart configures persistent volumes for:
- Consul server data
- Prometheus data
- Grafana dashboards
- Elasticsearch data
- Logstash data
- SonarQube data and PostgreSQL

## Security

- The application uses security headers and rate limiting
- Consul provides mTLS encryption between services
- Grafana and SonarQube passwords should be changed in production
- All services are configured with resource limits
- Health checks are enabled for the application

## Accessing the Services

After installation, you can access the services using the following URLs:

- Application: `http://<cluster-ip>:80`
- Consul UI: `http://<cluster-ip>:8500`
- Grafana: `http://<cluster-ip>:3000`
- Kibana: `http://<cluster-ip>:5601`
- SonarQube: `http://<cluster-ip>:9000`

## Upgrading

To upgrade the chart:

```bash
helm upgrade 24hr-story ./helm/24hr-story
```

## Uninstalling

To uninstall/delete the deployment:

```bash
helm uninstall 24hr-story
```

## Troubleshooting

1. Check pod status:
```bash
kubectl get pods -l release=24hr-story
```

2. Check pod logs:
```bash
kubectl logs -l release=24hr-story
```

3. Check Consul service health:
```bash
kubectl exec -it <consul-server-pod> -- consul members
```

4. Check persistent volume claims:
```bash
kubectl get pvc -l release=24hr-story
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 