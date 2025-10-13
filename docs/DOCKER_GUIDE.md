# Docker 개발 환경 가이드

## 📋 개요

AgenticCP-Web 프로젝트는 Docker를 사용하여 일관된 개발 환경을 제공합니다.

## 🎯 왜 Docker를 사용하나요?

### 장점

1. **일관된 환경**: 모든 개발자가 동일한 Node.js 버전과 의존성 사용
2. **빠른 시작**: 복잡한 로컬 환경 설정 불필요
3. **격리된 환경**: 시스템 전역 패키지 오염 방지
4. **쉬운 백엔드 연동**: Docker 네트워크를 통한 간편한 서비스 간 통신
5. **프로덕션 환경 시뮬레이션**: 배포 환경과 유사한 개발 환경

### 사전 요구사항

- Docker 20.10 이상
- Docker Compose 1.29 이상

## 🚀 빠른 시작

### 1. 개발 환경 시작

```bash
# 간편 스크립트 사용
./scripts/docker-dev.sh

# 또는 직접 명령어 실행
docker-compose up --build
```

### 2. 브라우저 접속

http://localhost:3000

### 3. 개발 시작

소스 코드를 수정하면 자동으로 브라우저에 반영됩니다! (Hot Module Replacement)

## 📦 Docker 구성 요소

### Dockerfile.dev (개발용)

개발 환경을 위한 Docker 이미지 정의

- **기반 이미지**: Node.js 20 Alpine
- **특징**: 
  - 경량화된 Linux 배포판 (Alpine)
  - 개발 서버 실행
  - 볼륨 마운트를 통한 실시간 코드 반영

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Dockerfile (프로덕션용)

프로덕션 배포를 위한 멀티 스테이지 빌드

- **Stage 1**: 빌드 단계 (Node.js 20)
- **Stage 2**: 서빙 단계 (Nginx)
- **특징**: 최소 이미지 크기, 최적화된 성능

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml (개발용)

개발 환경 오케스트레이션

```yaml
services:
  agenticcp-web:
    container_name: agenticcp-web-dev
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app              # 소스 코드 마운트
      - /app/node_modules   # node_modules 보호
    environment:
      - NODE_ENV=development
    networks:
      - agenticcp-network
```

**핵심 설정:**
- **volumes**: 로컬 코드를 컨테이너에 마운트하여 실시간 반영
- **networks**: 백엔드와 통신을 위한 공유 네트워크

### vite.config.ts

Docker 환경을 위한 Vite 설정

```typescript
server: {
  port: 3000,
  host: true,           // 모든 주소에서 접근 가능 (Docker 필수)
  watch: {
    usePolling: true,   // Docker 볼륨에서 파일 변경 감지
  },
}
```

## 🛠️ Docker 명령어

### 기본 명령어

```bash
# 컨테이너 시작
docker-compose up

# 백그라운드 실행
docker-compose up -d

# 빌드와 함께 시작
docker-compose up --build

# 컨테이너 중지
docker-compose down

# 컨테이너 중지 + 볼륨 삭제
docker-compose down -v
```

### 편의 스크립트

```bash
# 개발 서버 시작
./scripts/docker-dev.sh

# 컨테이너 중지
./scripts/docker-stop.sh

# 캐시 없이 재빌드
./scripts/docker-rebuild.sh
```

### 로그 확인

```bash
# 실시간 로그 확인
docker-compose logs -f

# 특정 서비스 로그만 보기
docker-compose logs -f agenticcp-web

# 마지막 100줄만 보기
docker-compose logs --tail=100 agenticcp-web
```

### 컨테이너 내부 접속

```bash
# 쉘 접속
docker exec -it agenticcp-web-dev sh

# 컨테이너 내부에서 명령어 실행
docker exec -it agenticcp-web-dev npm run lint
```

## 🔗 백엔드와 연동

### Docker 네트워크 구성

AgenticCP는 `agenticcp-network`라는 공유 네트워크를 사용합니다.

```bash
# 네트워크 생성 (자동으로 생성됨)
docker network create agenticcp-network

# 네트워크 확인
docker network inspect agenticcp-network
```

### 백엔드와 함께 실행

```bash
# 1. 백엔드 실행 (AgenticCP-Core)
cd ../AgenticCP-Core
docker-compose up -d

# 2. 프론트엔드 실행 (AgenticCP-Web)
cd ../AgenticCP-Web
./scripts/docker-dev.sh
```

### 환경 변수 설정

`.env` 파일에서 백엔드 URL 설정:

```env
VITE_API_BASE_URL=http://agenticcp-backend:8080
```

Docker 네트워크 내에서는 컨테이너 이름으로 통신합니다.

## 🎨 개발 워크플로우

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd AgenticCP-Web
```

### 2. Docker 환경 시작

```bash
./scripts/docker-dev.sh
```

### 3. 코드 수정

- 소스 코드를 수정하면 자동으로 반영됩니다
- 브라우저가 자동으로 새로고침됩니다 (HMR)

### 4. 의존성 추가

```bash
# 컨테이너 내부에서 실행
docker exec -it agenticcp-web-dev sh
npm install <package-name>
exit

# 또는 로컬에서 설치 후 재빌드
npm install <package-name>
docker-compose down
docker-compose up --build
```

### 5. 디버깅

```bash
# 로그 확인
docker-compose logs -f

# 컨테이너 상태 확인
docker-compose ps

# 컨테이너 재시작
docker-compose restart
```

## 🚀 프로덕션 배포

### 1. 프로덕션 이미지 빌드

```bash
docker build -t agenticcp-web:latest .
```

### 2. 이미지 실행

```bash
docker run -p 80:80 agenticcp-web:latest
```

### 3. Docker Compose로 실행

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. 이미지 최적화

프로덕션 이미지는 다음과 같이 최적화되어 있습니다:

- **멀티 스테이지 빌드**: 최종 이미지 크기 최소화
- **Nginx 사용**: 정적 파일 서빙 최적화
- **압축 활성화**: Gzip 압축으로 전송 크기 감소
- **캐싱 전략**: 정적 자산의 브라우저 캐싱

## 🐛 트러블슈팅

### 문제: 파일 변경이 반영되지 않음

**원인**: Docker 볼륨 마운트의 파일 감지 문제

**해결**:
```bash
# vite.config.ts에 polling 설정 확인
server: {
  watch: {
    usePolling: true,
  },
}

# 컨테이너 재시작
docker-compose down -v
docker-compose up --build
```

### 문제: 포트 충돌

**원인**: 3000 포트가 이미 사용 중

**해결**:
```bash
# docker-compose.yml에서 포트 변경
ports:
  - "3001:3000"  # 호스트 포트를 3001로 변경
```

### 문제: node_modules 관련 오류

**원인**: 호스트와 컨테이너의 node_modules 충돌

**해결**:
```bash
# 로컬 node_modules 삭제
rm -rf node_modules

# 컨테이너 재빌드
docker-compose down -v
docker-compose up --build
```

### 문제: 메모리 부족

**원인**: Docker Desktop의 메모리 제한

**해결**:
1. Docker Desktop 설정 열기
2. Resources > Memory 증가 (최소 4GB 권장)
3. Apply & Restart

### 문제: 네트워크 연결 실패

**원인**: Docker 네트워크 문제

**해결**:
```bash
# 네트워크 재생성
docker network rm agenticcp-network
docker network create agenticcp-network

# 컨테이너 재시작
docker-compose down
docker-compose up
```

### 문제: 빌드가 느림

**원인**: 빌드 캐시 미사용

**해결**:
```bash
# BuildKit 활성화 (더 빠른 빌드)
export DOCKER_BUILDKIT=1

# 빌드 캐시 활용
docker-compose build
```

## 📊 성능 최적화

### 1. 빌드 캐시 활용

```dockerfile
# 의존성만 먼저 복사하여 캐시 활용
COPY package*.json ./
RUN npm ci
COPY . .
```

### 2. .dockerignore 사용

불필요한 파일 제외로 빌드 속도 향상:

```
node_modules
dist
.git
*.log
```

### 3. 멀티 스테이지 빌드

프로덕션 이미지 크기 최소화:

```dockerfile
FROM node:20-alpine AS builder
# ... 빌드

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

## 🔐 보안 고려사항

### 1. 비밀번호 관리

환경 변수를 통한 민감 정보 관리:

```yaml
environment:
  - API_KEY=${API_KEY}
```

### 2. 최소 권한 원칙

```dockerfile
# 루트 사용자 대신 일반 사용자 사용
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

### 3. 이미지 스캔

```bash
# 보안 취약점 스캔
docker scan agenticcp-web:latest
```

## 📚 참고 자료

- [Docker 공식 문서](https://docs.docker.com/)
- [Docker Compose 공식 문서](https://docs.docker.com/compose/)
- [Vite Docker 가이드](https://vitejs.dev/guide/static-deploy.html#docker)
- [Node.js Docker 베스트 프랙티스](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

## 💡 팁과 트릭

### 빠른 재시작

```bash
# 빌드 없이 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart agenticcp-web
```

### 로그 필터링

```bash
# 에러 로그만 보기
docker-compose logs | grep ERROR

# 특정 시간 이후 로그
docker-compose logs --since 30m
```

### 리소스 모니터링

```bash
# 컨테이너 리소스 사용량 확인
docker stats agenticcp-web-dev
```

---

Docker 개발 환경에 대한 질문이 있으시면 팀 채널에 문의해주세요!

