#!/bin/bash

# Rebuild Docker containers without cache

set -e

echo "🔄 Docker 이미지 재빌드 중 (캐시 없이)..."

docker-compose down
docker-compose build --no-cache
docker-compose up

echo "✅ 재빌드 완료!"

