#!/bin/bash
set -e

# colors
RED="\033[1;31m"
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
NOCOLOR="\033[0m"

echo -e "${GREEN}Creating resources${NOCOLOR}"
echo

echo -e "${YELLOW}Creating SQS: ${NOCOLOR} video-processing-queue"
aws sqs --endpoint-url=http://localhost:4566 --region=us-east-1 create-queue \
    --queue-name video-processing-queue | tee > /dev/null 2>&1

echo -e "${YELLOW}Creating S3: ${NOCOLOR} video-bucket"
aws s3 --endpoint-url=http://localhost:4566 --region=us-east-1 \
    mb s3://video-bucket | tee > /dev/null 2>&1

echo -e "${GREEN}Resources created successfully!${NOCOLOR}"

