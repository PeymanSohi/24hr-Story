variable "app_port" {
  description = "Port for the main application"
  type        = number
  default     = 3000
}

variable "grafana_port" {
  description = "Port for Grafana"
  type        = number
  default     = 3001
}

variable "sonarqube_port" {
  description = "Port for SonarQube"
  type        = number
  default     = 9000
}

variable "elasticsearch_port" {
  description = "Port for Elasticsearch"
  type        = number
  default     = 9200
}

variable "kibana_port" {
  description = "Port for Kibana"
  type        = number
  default     = 5601
}

variable "prometheus_port" {
  description = "Port for Prometheus"
  type        = number
  default     = 9090
}

variable "node_exporter_port" {
  description = "Port for Node Exporter"
  type        = number
  default     = 9100
}

variable "cadvisor_port" {
  description = "Port for cAdvisor"
  type        = number
  default     = 8080
}

variable "logstash_ports" {
  description = "Ports for Logstash"
  type = object({
    beats    = number
    tcp      = number
    udp      = number
    metrics  = number
  })
  default = {
    beats   = 5044
    tcp     = 5000
    udp     = 5000
    metrics = 9600
  }
}

variable "elasticsearch_memory" {
  description = "Memory settings for Elasticsearch"
  type = object({
    min = string
    max = string
  })
  default = {
    min = "512m"
    max = "512m"
  }
}

variable "logstash_memory" {
  description = "Memory settings for Logstash"
  type = object({
    min = string
    max = string
  })
  default = {
    min = "256m"
    max = "256m"
  }
}

variable "grafana_admin_password" {
  description = "Admin password for Grafana"
  type        = string
  default     = "admin"
}

variable "sonarqube_db_password" {
  description = "Password for SonarQube database"
  type        = string
  default     = "sonar"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
} 