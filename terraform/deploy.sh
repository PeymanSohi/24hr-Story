#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Function to print colored messages
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    print_error "Terraform is not installed. Please install Terraform and try again."
    exit 1
fi

# Initialize Terraform
print_message "Initializing Terraform..."
terraform init

if [ $? -ne 0 ]; then
    print_error "Failed to initialize Terraform."
    exit 1
fi

# Validate Terraform configuration
print_message "Validating Terraform configuration..."
terraform validate

if [ $? -ne 0 ]; then
    print_error "Terraform configuration validation failed."
    exit 1
fi

# Create Terraform plan
print_message "Creating Terraform plan..."
terraform plan -out=tfplan

if [ $? -ne 0 ]; then
    print_error "Failed to create Terraform plan."
    exit 1
fi

# Apply Terraform configuration
print_message "Applying Terraform configuration..."
terraform apply tfplan

if [ $? -ne 0 ]; then
    print_error "Failed to apply Terraform configuration."
    exit 1
fi

# Show outputs
print_message "Infrastructure deployment completed successfully!"
print_message "Showing deployment outputs..."
terraform output

# Print access information
print_message "Access information:"
echo "----------------------------------------"
echo "Application: $(terraform output -raw app_url)"
echo "Grafana: $(terraform output -raw grafana_url)"
echo "SonarQube: $(terraform output -raw sonarqube_url)"
echo "Kibana: $(terraform output -raw kibana_url)"
echo "Prometheus: $(terraform output -raw prometheus_url)"
echo "----------------------------------------"

print_message "Grafana credentials:"
echo "Username: admin"
echo "Password: $(terraform output -raw grafana_admin_password)"

print_message "SonarQube credentials:"
echo "Username: sonar"
echo "Password: $(terraform output -raw sonarqube_db_password)"

print_message "Monitoring endpoints:"
terraform output -json monitoring_endpoints | jq -r 'to_entries | .[] | "\(.key): \(.value)"'

print_message "Logstash endpoints:"
terraform output -json logstash_endpoints | jq -r 'to_entries | .[] | "\(.key): \(.value)"'

print_message "Deployment completed successfully!" 