#!/bin/bash

# Stop Docker containers

set -e

echo "🛑 AgenticCP-Web Docker 컨테이너 중지 중..."

docker-compose down

echo "✅ 컨테이너가 중지되었습니다."

