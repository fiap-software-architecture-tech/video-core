#!/bin/bash

# ==========================================
# Build and Push Docker Image to ECR
# ==========================================
# This script builds the video-core Docker image and pushes it to AWS ECR
#
# Required Environment Variables:
#   - AWS_REGION: AWS region (e.g., us-east-1)
#   - ECR_REPOSITORY_URL: Full ECR repository URL
#   - ECR_REPOSITORY_NAME: ECR repository name
#   - IMAGE_TAG: Tag for the Docker image (e.g., git commit SHA)
#
# Optional Environment Variables:
#   - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN: AWS credentials
#
# Usage:
#   ./scripts/build-and-push.sh
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
    [ -z "$ECR_REPOSITORY_URL" ] && missing+=("ECR_REPOSITORY_URL")
    [ -z "$ECR_REPOSITORY_NAME" ] && missing+=("ECR_REPOSITORY_NAME")
    [ -z "$IMAGE_TAG" ] && missing+=("IMAGE_TAG")
    
    if [ ${#missing[@]} -ne 0 ]; then
        log_error "Missing required environment variables:"
        for var in "${missing[@]}"; do
            echo "  - $var"
        done
        exit 1
    fi
}

# Extract registry from ECR URL
extract_registry() {
    echo "$ECR_REPOSITORY_URL" | sed 's|/.*||'
}

# Main script
main() {
    print_header "🔨 Docker Build and Push Script"
    
    log_info "Validating environment variables..."
    validate_env
    
    ECR_REGISTRY=$(extract_registry)
    
    print_header "📋 Build Configuration"
    echo "Registry:     $ECR_REGISTRY"
    echo "Repository:   $ECR_REPOSITORY_NAME"
    echo "Full URL:     $ECR_REPOSITORY_URL"
    echo "Image Tag:    $IMAGE_TAG"
    echo "AWS Region:   $AWS_REGION"
    
    # Step 1: Login to ECR
    print_header "🔑 Logging in to Amazon ECR"
    log_info "Authenticating with ECR..."
    
    if aws ecr get-login-password --region "$AWS_REGION" | \
       docker login --username AWS --password-stdin "$ECR_REGISTRY"; then
        log_success "Successfully logged in to ECR"
    else
        log_error "Failed to login to ECR"
        exit 1
    fi
    
    # Step 2: Build Docker image
    print_header "🔨 Building Docker Image"
    log_info "Building image with tags: $IMAGE_TAG and latest"
    
    if docker build \
        -t "$ECR_REGISTRY/$ECR_REPOSITORY_NAME:$IMAGE_TAG" \
        -t "$ECR_REGISTRY/$ECR_REPOSITORY_NAME:latest" \
        .; then
        log_success "Docker image built successfully"
    else
        log_error "Failed to build Docker image"
        exit 1
    fi
    
    # Step 3: Push to ECR
    print_header "📤 Pushing Images to ECR"
    
    log_info "Pushing tag: $IMAGE_TAG"
    if docker push "$ECR_REGISTRY/$ECR_REPOSITORY_NAME:$IMAGE_TAG"; then
        log_success "Pushed $IMAGE_TAG"
    else
        log_error "Failed to push $IMAGE_TAG"
        exit 1
    fi
    
    log_info "Pushing tag: latest"
    if docker push "$ECR_REGISTRY/$ECR_REPOSITORY_NAME:latest"; then
        log_success "Pushed latest"
    else
        log_error "Failed to push latest"
        exit 1
    fi
    
    # Summary
    print_header "🎉 Build and Push Complete!"
    echo ""
    echo "📦 Image URL: $ECR_REGISTRY/$ECR_REPOSITORY_NAME"
    echo "🏷️  Tags:      $IMAGE_TAG, latest"
    echo "🌐 Region:    $AWS_REGION"
    echo ""
    log_success "Images are ready for deployment!"
}

# Run main function
main
