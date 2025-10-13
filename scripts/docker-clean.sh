#!/bin/bash

# Clean Docker environment

set -e

echo "🧹 Docker 환경 정리 중..."
echo ""

# Stop and remove containers
echo "🛑 컨테이너 중지 및 제거..."
docker-compose down -v

# Remove images
echo "🗑️  이미지 제거..."
docker-compose down --rmi local

# Clean build cache
echo "♻️  빌드 캐시 정리..."
docker builder prune -f

echo ""
echo "✅ Docker 환경 정리가 완료되었습니다!"
echo "💡 새로 시작하려면 './scripts/docker-dev.sh' 를 실행하세요."

