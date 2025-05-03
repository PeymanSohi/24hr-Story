output "app_url" {
  description = "URL for the main application"
  value       = "http://localhost:${var.app_port}"
}

output "grafana_url" {
  description = "URL for Grafana dashboard"
  value       = "http://localhost:${var.grafana_port}"
}

output "sonarqube_url" {
  description = "URL for SonarQube"
  value       = "http://localhost:${var.sonarqube_port}"
}

output "kibana_url" {
  description = "URL for Kibana"
  value       = "http://localhost:${var.kibana_port}"
}

output "prometheus_url" {
  description = "URL for Prometheus"
  value       = "http://localhost:${var.prometheus_port}"
}

output "grafana_credentials" {
  description = "Grafana admin credentials"
  value = {
    username = "admin"
    password = var.grafana_admin_password
  }
  sensitive = true
}

output "sonarqube_credentials" {
  description = "SonarQube database credentials"
  value = {
    username = "sonar"
    password = var.sonarqube_db_password
  }
  sensitive = true
}

output "monitoring_endpoints" {
  description = "Monitoring endpoints"
  value = {
    node_exporter = "http://localhost:${var.node_exporter_port}/metrics"
    cadvisor      = "http://localhost:${var.cadvisor_port}/metrics"
  }
}

output "logstash_endpoints" {
  description = "Logstash endpoints"
  value = {
    beats   = "localhost:${var.logstash_ports.beats}"
    tcp     = "localhost:${var.logstash_ports.tcp}"
    udp     = "localhost:${var.logstash_ports.udp}"
    metrics = "http://localhost:${var.logstash_ports.metrics}"
  }
} 