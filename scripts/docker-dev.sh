#!/bin/bash

# AgenticCP-Web Docker Development Script

set -e

echo "🚀 AgenticCP-Web Docker 개발 환경 시작"
echo ""

# Check if docker network exists, if not create it
if ! docker network inspect agenticcp-network >/dev/null 2>&1; then
    echo "📡 Docker 네트워크 생성 중..."
    docker network create agenticcp-network
    echo "✅ Docker 네트워크가 생성되었습니다."
else
    echo "✅ Docker 네트워크가 이미 존재합니다."
fi

echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚙️  환경 변수 파일 생성 중..."
    
    # Try to copy from .env.example if it exists
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env.example에서 복사하여 .env 파일을 생성했습니다."
    else
        # Create default .env file
        echo "📝 기본 .env 파일을 생성합니다..."
        cat > .env << 'EOF'
# API Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_API_TIMEOUT=30000

# Application Configuration
VITE_APP_NAME=AgenticCP
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_MOCK_API=false

# Authentication
VITE_TOKEN_KEY=agenticcp_token
VITE_REFRESH_TOKEN_KEY=agenticcp_refresh_token
EOF
        echo "✅ 기본 .env 파일이 생성되었습니다."
    fi
    echo "⚠️  필요한 경우 .env 파일을 수정해주세요."
else
    echo "✅ .env 파일이 이미 존재합니다."
fi

echo ""
echo "🏗️  Docker 컨테이너 빌드 및 시작 중..."
echo ""

# Build and start containers
docker-compose up --build

echo ""
echo "✅ 개발 서버가 시작되었습니다!"
echo "🌐 웹 브라우저에서 http://localhost:3000 으로 접속하세요"

