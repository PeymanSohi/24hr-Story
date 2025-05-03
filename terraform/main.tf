terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {}

# Create Docker network
resource "docker_network" "app_network" {
  name = "app-network"
  driver = "bridge"
}

# Create volumes
resource "docker_volume" "elasticsearch_data" {
  name = "elasticsearch_data"
}

resource "docker_volume" "prometheus_data" {
  name = "prometheus_data"
}

resource "docker_volume" "grafana_data" {
  name = "grafana_data"
}

resource "docker_volume" "sonarqube_data" {
  name = "sonarqube_data"
}

resource "docker_volume" "sonarqube_extensions" {
  name = "sonarqube_extensions"
}

resource "docker_volume" "sonarqube_logs" {
  name = "sonarqube_logs"
}

resource "docker_volume" "postgresql" {
  name = "postgresql"
}

resource "docker_volume" "postgresql_data" {
  name = "postgresql_data"
}

# Application Service
resource "docker_container" "app" {
  name  = "24hr-story-app"
  image = docker_image.app.image_id
  ports {
    internal = 3000
    external = 3000
  }
  env = [
    "NODE_ENV=production",
    "REACT_APP_API_URL=http://localhost:3000"
  ]
  volumes {
    host_path      = "${path.cwd}/src"
    container_path = "/app/src"
  }
  volumes {
    host_path      = "${path.cwd}/public"
    container_path = "/app/public"
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
  depends_on = [docker_container.elasticsearch]
  restart    = "unless-stopped"
}

# Test Service
resource "docker_container" "test" {
  name  = "24hr-story-test"
  image = docker_image.test.image_id
  volumes {
    host_path      = "${path.cwd}/src"
    container_path = "/app/src"
  }
  volumes {
    host_path      = "${path.cwd}/cypress"
    container_path = "/app/cypress"
  }
  volumes {
    host_path      = "${path.cwd}/coverage"
    container_path = "/app/coverage"
  }
  env = ["CI=true"]
  command = ["sh", "-c", "npm run test && npm run cypress:run"]
  networks_advanced {
    name = docker_network.app_network.name
  }
}

# SonarQube Database
resource "docker_container" "sonarqube_db" {
  name  = "sonarqube-db"
  image = "postgres:13"
  env = [
    "POSTGRES_USER=sonar",
    "POSTGRES_PASSWORD=sonar",
    "POSTGRES_DB=sonar"
  ]
  volumes {
    volume_name    = docker_volume.postgresql.name
    container_path = "/var/lib/postgresql"
  }
  volumes {
    volume_name    = docker_volume.postgresql_data.name
    container_path = "/var/lib/postgresql/data"
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
  restart = "unless-stopped"
}

# SonarQube
resource "docker_container" "sonarqube" {
  name  = "sonarqube"
  image = "sonarqube:latest"
  ports {
    internal = 9000
    external = 9000
  }
  env = [
    "SONAR_JDBC_URL=jdbc:postgresql://sonarqube-db:5432/sonar",
    "SONAR_JDBC_USERNAME=sonar",
    "SONAR_JDBC_PASSWORD=sonar"
  ]
  volumes {
    volume_name    = docker_volume.sonarqube_data.name
    container_path = "/opt/sonarqube/data"
  }
  volumes {
    volume_name    = docker_volume.sonarqube_extensions.name
    container_path = "/opt/sonarqube/extensions"
  }
  volumes {
    volume_name    = docker_volume.sonarqube_logs.name
    container_path = "/opt/sonarqube/logs"
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
  depends_on = [docker_container.sonarqube_db]
  restart    = "unless-stopped"
}

# Elasticsearch
resource "docker_container" "elasticsearch" {
  name  = "elasticsearch"
  image = "docker.elastic.co/elasticsearch/elasticsearch:8.12.1"
  env = [
    "discovery.type=single-node",
    "xpack.security.enabled=false",
    "ES_JAVA_OPTS=-Xms512m -Xmx512m"
  ]
  ulimits {
    memlock {
      soft = -1
      hard = -1
    }
  }
  volumes {
    volume_name    = docker_volume.elasticsearch_data.name
    container_path = "/usr/share/elasticsearch/data"
  }
  ports {
    internal = 9200
    external = 9200
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
  restart = "unless-stopped"
}

# Logstash
resource "docker_container" "logstash" {
  name  = "logstash"
  image = "docker.elastic.co/logstash/logstash:8.12.1"
  volumes {
    host_path      = "${path.cwd}/elk/logstash/pipeline"
    container_path = "/usr/share/logstash/pipeline"
  }
  volumes {
    host_path      = "${path.cwd}/elk/logstash/config/logstash.yml"
    container_path = "/usr/share/logstash/config/logstash.yml"
  }
  ports {
    internal = 5044
    external = 5044
  }
  ports {
    internal = 5000
    external = 5000
    protocol = "tcp"
  }
  ports {
    internal = 5000
    external = 5000
    protocol = "udp"
  }
  ports {
    internal = 9600
    external = 9600
  }
  env = ["LS_JAVA_OPTS=-Xmx256m -Xms256m"]
  networks_advanced {
    name = docker_network.app_network.name
  }
  depends_on = [docker_container.elasticsearch]
  restart    = "unless-stopped"
}

# Kibana
resource "docker_container" "kibana" {
  name  = "kibana"
  image = "docker.elastic.co/kibana/kibana:8.12.1"
  ports {
    internal = 5601
    external = 5601
  }
  env = ["ELASTICSEARCH_HOSTS=http://elasticsearch:9200"]
  volumes {
    host_path      = "${path.cwd}/elk/kibana/config/kibana.yml"
    container_path = "/usr/share/kibana/config/kibana.yml"
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
  depends_on = [docker_container.elasticsearch]
  restart    = "unless-stopped"
}

# Prometheus
resource "docker_container" "prometheus" {
  name  = "prometheus"
  image = "prom/prometheus:latest"
  ports {
    internal = 9090
    external = 9090
  }
  volumes {
    host_path      = "${path.cwd}/monitoring/prometheus.yml"
    container_path = "/etc/prometheus/prometheus.yml"
  }
  volumes {
    volume_name    = docker_volume.prometheus_data.name
    container_path = "/prometheus"
  }
  command = [
    "--config.file=/etc/prometheus/prometheus.yml",
    "--storage.tsdb.path=/prometheus",
    "--web.console.libraries=/usr/share/prometheus/console_libraries",
    "--web.console.templates=/usr/share/prometheus/consoles"
  ]
  networks_advanced {
    name = docker_network.app_network.name
  }
  restart = "unless-stopped"
}

# Grafana
resource "docker_container" "grafana" {
  name  = "grafana"
  image = "grafana/grafana:latest"
  ports {
    internal = 3000
    external = 3001
  }
  volumes {
    host_path      = "${path.cwd}/monitoring/grafana-dashboard.json"
    container_path = "/etc/grafana/provisioning/dashboards/24hr-story.json"
  }
  volumes {
    volume_name    = docker_volume.grafana_data.name
    container_path = "/var/lib/grafana"
  }
  env = [
    "GF_SECURITY_ADMIN_PASSWORD=admin",
    "GF_USERS_ALLOW_SIGN_UP=false"
  ]
  networks_advanced {
    name = docker_network.app_network.name
  }
  depends_on = [docker_container.prometheus]
  restart    = "unless-stopped"
}

# Node Exporter
resource "docker_container" "node_exporter" {
  name  = "node-exporter"
  image = "prom/node-exporter:latest"
  ports {
    internal = 9100
    external = 9100
  }
  volumes {
    host_path      = "/proc"
    container_path = "/host/proc"
    read_only      = true
  }
  volumes {
    host_path      = "/sys"
    container_path = "/host/sys"
    read_only      = true
  }
  volumes {
    host_path      = "/"
    container_path = "/rootfs"
    read_only      = true
  }
  command = [
    "--path.procfs=/host/proc",
    "--path.sysfs=/host/sys",
    "--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)"
  ]
  networks_advanced {
    name = docker_network.app_network.name
  }
  restart = "unless-stopped"
}

# cAdvisor
resource "docker_container" "cadvisor" {
  name  = "cadvisor"
  image = "gcr.io/cadvisor/cadvisor:latest"
  ports {
    internal = 8080
    external = 8080
  }
  volumes {
    host_path      = "/"
    container_path = "/rootfs"
    read_only      = true
  }
  volumes {
    host_path      = "/var/run"
    container_path = "/var/run"
    read_only      = true
  }
  volumes {
    host_path      = "/sys"
    container_path = "/sys"
    read_only      = true
  }
  volumes {
    host_path      = "/var/lib/docker"
    container_path = "/var/lib/docker"
    read_only      = true
  }
  volumes {
    host_path      = "/dev/disk"
    container_path = "/dev/disk"
    read_only      = true
  }
  networks_advanced {
    name = docker_network.app_network.name
  }
  restart = "unless-stopped"
}

# Docker images
resource "docker_image" "app" {
  name = "24hr-story-app:latest"
  build {
    context = "."
    dockerfile = "Dockerfile"
  }
}

resource "docker_image" "test" {
  name = "24hr-story-test:latest"
  build {
    context = "."
    dockerfile = "Dockerfile.test"
  }
} 