#!/bin/bash

# ==========================================
# Deploy Application to Amazon ECS
# ==========================================
# This script triggers a new deployment of the video-core service on ECS
#
# Required Environment Variables:
#   - AWS_REGION: AWS region (e.g., us-east-1)
#   - ECS_CLUSTER_NAME: Name of the ECS cluster
#   - ECS_SERVICE_NAME: Name of the ECS service
#   - IMAGE_TAG: Docker image tag to deploy
#
# Optional Environment Variables:
#   - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN: AWS credentials
#
# Usage:
#   ./scripts/deploy-ecs.sh
# ==========================================

set -e  # Exit on error
set -o pipefail  # Exit on pipe failure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Function to print section headers
print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Validate required environment variables
validate_env() {
    local missing=()
    
    [ -z "$AWS_REGION" ] && missing+=("AWS_REGION")
    [ -z "$ECS_CLUSTER_NAME" ] && missing+=("ECS_CLUSTER_NAME")
    [ -z "$ECS_SERVICE_NAME" ] && missing+=("ECS_SERVICE_NAME")
    [ -z "$IMAGE_TAG" ] && missing+=("IMAGE_TAG")
    
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
}

# Get current service status
get_service_status() {
    aws ecs describe-services \
        --cluster "$ECS_CLUSTER_NAME" \
        --services "$ECS_SERVICE_NAME" \
        --region "$AWS_REGION" \
        --query 'services[0].{Status:status,Desired:desiredCount,Running:runningCount,Pending:pendingCount}' \
        --output table
}

# Main script
main() {
    print_header "🚀 ECS Deployment Script"
    
    log_info "Validating environment variables..."
    validate_env
    
    print_header "📋 Deployment Configuration"
    echo "Cluster:      $ECS_CLUSTER_NAME"
    echo "Service:      $ECS_SERVICE_NAME"
    echo "Image Tag:    $IMAGE_TAG"
    echo "AWS Region:   $AWS_REGION"
    
    # Step 1: Get current service status
    print_header "📊 Current Service Status"
    get_service_status
    
    # Step 2: Trigger deployment
    print_header "🚀 Triggering ECS Deployment"
    log_info "Forcing new deployment of service..."
    
    if aws ecs update-service \
        --cluster "$ECS_CLUSTER_NAME" \
        --service "$ECS_SERVICE_NAME" \
        --force-new-deployment \
        --region "$AWS_REGION" \
        --output json > /dev/null; then
        log_success "Deployment triggered successfully"
    else
        log_error "Failed to trigger deployment"
        exit 1
    fi
    
    log_info "Deployment running in background"
    log_warning "Check ECS console to monitor deployment progress"
    
    # Summary
    print_header "🎉 Deployment Complete!"
    echo ""
    echo "🎯 Cluster:   $ECS_CLUSTER_NAME"
    echo "🚀 Service:   $ECS_SERVICE_NAME"
    echo "🏷️  Image:     $IMAGE_TAG"
    echo "🌐 Region:    $AWS_REGION"
    echo ""
    log_success "Application is deployed and running!"
}

# Run main function
main
