import { apiRequest } from './api';

export interface AgentRequest {
  message: string;
  thread_id?: string;
  stream?: boolean;
  context?: {
    user_id?: string;
    session_id?: string;
  };
}

export interface AgentResponse {
  success: boolean;
  response: string;
  agent_used?: string;
  confidence?: number;
  routing_info?: {
    intent: string;
    confidence: number;
    processing_time: number;
  };
  thread_id: string;
  timestamp: string;
  processing_time: number;
}

// 실제 API 응답 타입
export interface ApiAgentResponse {
  success: boolean;
  response: string;
  agent_used?: string;
  confidence?: number;
  routing_info?: {
    intent: string;
    confidence: number;
    processing_time: number;
  };
  thread_id: string;
  timestamp: string;
  processing_time: number;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

// API 엔드포인트 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 실제 API 호출 함수
export const callAgentAPI = async (userRequest: string): Promise<AgentResponse> => {
  try {
    // 개발 모드에서는 프록시 사용, 프로덕션에서는 직접 API 호출
    const apiUrl = import.meta.env.DEV 
      ? '/api/v1/multi-agent/chat'  // Vite 프록시 사용
      : `${API_BASE_URL}/api/v1/multi-agent/chat`;  // 직접 API 호출
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userRequest,
        thread_id: `user-session-${Date.now()}`,
        stream: false,
        context: {
          user_id: 'user-001',
          session_id: 'session-456'
        }
      }),
      signal: AbortSignal.timeout(10000) // 10초 타임아웃
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }

    const data: ApiAgentResponse = await response.json();
    
    return {
      success: data.success,
      response: data.response,
      agent_used: data.agent_used,
      confidence: data.confidence,
      routing_info: data.routing_info,
      thread_id: data.thread_id,
      timestamp: data.timestamp,
      processing_time: data.processing_time
    };
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw new Error('AI Agent 서비스에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
  }
};

// Mock 응답 생성 함수
const getMockResponse = (userRequest: string): AgentResponse => {
  const lowerRequest = userRequest.toLowerCase();
  
  // 기능별 맞춤 응답
  if (lowerRequest.includes('대시보드') || lowerRequest.includes('dashboard')) {
    return {
      success: true,
      response: `## 📊 대시보드 기능 안내

AgenticCP 대시보드에서 다음 기능들을 사용할 수 있습니다:

### 🎯 주요 기능
- **리소스 현황**: 클라우드 리소스 상태 모니터링
- **비용 분석**: 실시간 비용 추적 및 분석
- **성능 메트릭**: 시스템 성능 지표 확인
- **알림 관리**: 중요 이벤트 알림 설정

### 🚀 빠른 액션
- 대시보드 새로고침
- 특정 리소스 필터링
- 기간별 데이터 조회

어떤 대시보드 기능을 사용하고 싶으신가요?`,
      agent_used: 'supervisor',
      confidence: 0.9,
      routing_info: {
        intent: 'dashboard_info',
        confidence: 0.95,
        processing_time: 0.5
      },
      thread_id: 'mock-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      processing_time: 0.5
    };
  }
  
  if (lowerRequest.includes('클라우드') || lowerRequest.includes('cloud') || lowerRequest.includes('리소스')) {
    return {
      success: true,
      response: `## ☁️ 클라우드 리소스 관리

### 📋 지원하는 클라우드 프로바이더
- **AWS**: EC2, S3, RDS, Lambda 등
- **Azure**: Virtual Machines, Blob Storage, SQL Database
- **GCP**: Compute Engine, Cloud Storage, BigQuery

### 🔧 리소스 관리 기능
- **인벤토리**: 모든 리소스 목록 조회
- **모니터링**: 리소스 상태 및 성능 추적
- **비용 관리**: 리소스별 비용 분석
- **자동화**: 스케일링 및 최적화

### 💡 추천 명령어
- "AWS EC2 인스턴스 목록 보여줘"
- "가장 비싼 리소스 찾아줘"
- "중지된 인스턴스 확인해줘"

어떤 클라우드 리소스를 관리하고 싶으신가요?`,
      agent_used: 'ec2',
      confidence: 0.85,
      routing_info: {
        intent: 'cloud_resources',
        confidence: 0.9,
        processing_time: 0.8
      },
      thread_id: 'mock-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      processing_time: 0.8
    };
  }
  
  if (lowerRequest.includes('비용') || lowerRequest.includes('cost') || lowerRequest.includes('돈')) {
    return {
      success: true,
      response: `## 💰 비용 관리 기능

### 📊 비용 분석 도구
- **실시간 비용**: 현재 월 비용 및 예상 비용
- **리소스별 비용**: 각 리소스의 상세 비용 분석
- **트렌드 분석**: 비용 증감 추이 및 예측
- **예산 관리**: 예산 설정 및 알림

### 🎯 비용 최적화
- **미사용 리소스**: 사용하지 않는 리소스 식별
- **리사이징 추천**: 비용 효율적인 인스턴스 타입 제안
- **스팟 인스턴스**: 비용 절약을 위한 스팟 인스턴스 활용

### 📈 비용 리포트
- 일별/월별/연도별 비용 리포트
- 부서별/프로젝트별 비용 분할
- 예산 대비 실제 비용 비교

어떤 비용 정보를 확인하고 싶으신가요?`,
      agent_used: 'cost',
      confidence: 0.88,
      routing_info: {
        intent: 'cost_management',
        confidence: 0.92,
        processing_time: 0.6
      },
      thread_id: 'mock-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      processing_time: 0.6
    };
  }
  
  if (lowerRequest.includes('모니터링') || lowerRequest.includes('monitoring') || lowerRequest.includes('알림')) {
    return {
      success: true,
      response: `## 📊 모니터링 및 알림 시스템

### 🔍 모니터링 기능
- **시스템 메트릭**: CPU, 메모리, 디스크 사용률
- **애플리케이션 성능**: 응답 시간, 처리량, 에러율
- **인프라 상태**: 서버, 네트워크, 데이터베이스 상태
- **로그 분석**: 실시간 로그 모니터링 및 분석

### 🚨 알림 설정
- **임계값 알림**: CPU/메모리 사용률 임계값 설정
- **이벤트 알림**: 시스템 이벤트 및 에러 알림
- **스케줄 알림**: 정기적인 상태 리포트
- **통합 알림**: Slack, 이메일, SMS 알림

### 📈 대시보드
- **실시간 대시보드**: 현재 상태 한눈에 보기
- **커스텀 위젯**: 필요한 메트릭만 선택
- **히스토리 차트**: 과거 데이터 추이 분석

어떤 모니터링 기능을 설정하고 싶으신가요?`,
      agent_used: 'monitoring',
      confidence: 0.82,
      routing_info: {
        intent: 'monitoring_setup',
        confidence: 0.88,
        processing_time: 0.7
      },
      thread_id: 'mock-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      processing_time: 0.7
    };
  }
  
  if (lowerRequest.includes('보안') || lowerRequest.includes('security') || lowerRequest.includes('컴플라이언스')) {
    return {
      success: true,
      response: `## 🔒 보안 및 컴플라이언스

### 🛡️ 보안 기능
- **접근 제어**: 사용자 권한 및 역할 관리
- **네트워크 보안**: 방화벽, 보안 그룹 설정
- **데이터 보호**: 암호화, 백업, 복구
- **취약점 관리**: 보안 스캔 및 패치 관리

### 📋 컴플라이언스
- **규정 준수**: GDPR, HIPAA, SOX 등 규정 준수
- **감사 로그**: 모든 활동 추적 및 기록
- **정책 관리**: 보안 정책 설정 및 관리
- **리포트**: 컴플라이언스 리포트 생성

### 🔍 보안 모니터링
- **실시간 위협 탐지**: 이상 활동 감지
- **로그 분석**: 보안 이벤트 분석
- **인시던트 대응**: 보안 사고 대응 절차

어떤 보안 기능을 확인하고 싶으신가요?`,
      agent_used: 'security',
      confidence: 0.91,
      routing_info: {
        intent: 'security_check',
        confidence: 0.94,
        processing_time: 0.9
      },
      thread_id: 'mock-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      processing_time: 0.9
    };
  }
  
  if (lowerRequest.includes('테넌트') || lowerRequest.includes('tenant') || lowerRequest.includes('사용자')) {
    return {
      success: true,
      response: `## 👥 테넌트 및 사용자 관리

### 🏢 테넌트 관리
- **멀티 테넌트**: 여러 조직의 독립적인 환경 제공
- **리소스 격리**: 테넌트별 리소스 분리 및 보안
- **할당량 관리**: 테넌트별 리소스 할당량 설정
- **비용 분할**: 테넌트별 비용 추적 및 청구

### 👤 사용자 관리
- **역할 기반 접근**: SUPER_ADMIN, TENANT_ADMIN, CLOUD_ADMIN, DEVELOPER
- **권한 관리**: 세밀한 권한 설정 및 제어
- **SSO 연동**: Single Sign-On 지원
- **감사 로그**: 사용자 활동 추적

### 🔧 관리 기능
- **사용자 초대**: 이메일을 통한 사용자 초대
- **그룹 관리**: 사용자 그룹 생성 및 관리
- **정책 설정**: 테넌트별 정책 및 규칙 설정

어떤 테넌트 관리 기능을 사용하고 싶으신가요?`,
      agent_used: 'tenant',
      confidence: 0.86,
      routing_info: {
        intent: 'tenant_management',
        confidence: 0.89,
        processing_time: 0.6
      },
      thread_id: 'mock-session-' + Date.now(),
      timestamp: new Date().toISOString(),
      processing_time: 0.6
    };
  }
  
  // 기본 응답
  const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
  return {
    success: true,
    response: randomResponse,
    agent_used: 'supervisor',
    confidence: 0.7,
    routing_info: {
      intent: 'general',
      confidence: 0.75,
      processing_time: 0.3
    },
    thread_id: 'mock-session-' + Date.now(),
    timestamp: new Date().toISOString(),
    processing_time: 0.3
  };
};

// 🔧 개발용 Mock 응답 (API 연결 전까지 사용)
const MOCK_RESPONSES = [
  `## 📊 AWS 리소스 현황

현재 실행 중인 **AWS EC2 인스턴스**는 **5개**입니다.

### 📋 인스턴스 목록

| 인스턴스 ID | 타입 | 상태 | 비용/시간 |
|-------------|------|------|-----------|
| i-1234567890 | t3.micro | 🟢 실행중 | $0.01 |
| i-2345678901 | t3.small | 🟢 실행중 | $0.02 |
| i-3456789012 | t3.medium | 🟡 중지됨 | $0.00 |

> **💡 팁**: 중지된 인스턴스도 스토리지 비용이 발생할 수 있습니다.

### 🔧 관리 명령어

다음 명령어로 인스턴스를 관리할 수 있습니다:

\`\`\`bash
# 인스턴스 상태 확인
aws ec2 describe-instances --instance-ids i-1234567890

# 인스턴스 시작
aws ec2 start-instances --instance-ids i-3456789012
\`\`\`

### 📈 비용 분석

- **이번 달 총 비용**: $1,234.56
- **가장 비싼 리소스**: EC2 (t3.large) - $456.78
- **예상 절약액**: $200 (불필요한 인스턴스 중지 시)`,

  `## 💰 클라우드 비용 분석 리포트

### 📊 월별 비용 현황

| 서비스 | 이번 달 | 지난 달 | 증감률 |
|--------|---------|---------|--------|
| EC2 | $800.00 | $750.00 | +6.7% |
| S3 | $150.00 | $120.00 | +25% |
| RDS | $200.00 | $180.00 | +11% |
| 기타 | $84.56 | $90.00 | -6% |

### 🎯 최적화 제안

1. **EC2 인스턴스 최적화**
   - 사용률이 낮은 t3.large → t3.medium 변경
   - 예상 절약액: **$200/월**

2. **S3 스토리지 최적화**
   - 오래된 파일을 Glacier로 이동
   - 예상 절약액: **$50/월**

### 📝 Python 스크립트 예시

\`\`\`python
import boto3
from datetime import datetime, timedelta

def analyze_costs():
    """클라우드 비용 분석"""
    ce = boto3.client('ce')
    
    # 지난 30일 비용 조회
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    response = ce.get_cost_and_usage(
        TimePeriod={
            'Start': start_date.strftime('%Y-%m-%d'),
            'End': end_date.strftime('%Y-%m-%d')
        },
        Granularity='MONTHLY',
        Metrics=['BlendedCost']
    )
    
    return response

# 사용 예시
costs = analyze_costs()
print(f"총 비용: {costs['ResultsByTime'][0]['Total']['BlendedCost']['Amount']}")
\`\`\`

> **⚠️ 주의**: 비용이 급증한 서비스에 대해 즉시 검토가 필요합니다.`,

  `## 🚨 모니터링 알림 현황

### 📈 시스템 상태

- **전체 상태**: 🟢 정상
- **활성 알림**: 3개
- **해결된 알림**: 12개 (지난 24시간)

### 🔔 최근 알림

1. **높은 CPU 사용률**
   - 서버: web-server-01
   - CPU 사용률: 85%
   - 시간: 2시간 전
   - 상태: 🔴 해결 필요

2. **디스크 공간 부족**
   - 서버: db-server-02
   - 사용률: 92%
   - 시간: 1시간 전
   - 상태: 🟡 모니터링 중

### 🛠️ 해결 방법

\`\`\`bash
# CPU 사용률 확인
top -p $(pgrep -f "your-application")

# 디스크 사용량 확인
df -h
du -sh /var/log/*

# 로그 정리 (주의: 중요한 로그는 백업 후)
sudo find /var/log -name "*.log" -mtime +30 -delete
\`\`\`

### 📊 모니터링 대시보드

| 메트릭 | 현재값 | 임계값 | 상태 |
|--------|--------|--------|------|
| CPU 사용률 | 45% | 80% | 🟢 정상 |
| 메모리 사용률 | 67% | 85% | 🟢 정상 |
| 디스크 사용률 | 78% | 90% | 🟡 주의 |
| 네트워크 I/O | 120MB/s | 500MB/s | 🟢 정상 |

> **💡 권장사항**: 디스크 사용률이 높으니 로그 정리나 스토리지 확장을 고려해보세요.`,

  `## ⚡ 리소스 최적화 제안

### 🎯 즉시 적용 가능한 최적화

#### 1. **EC2 인스턴스 최적화**
- **현재**: t3.large (2 vCPU, 8GB RAM)
- **권장**: t3.medium (2 vCPU, 4GB RAM)
- **예상 절약**: $50/월

#### 2. **자동 스케일링 설정**

\`\`\`yaml
# CloudFormation 템플릿
AutoScalingGroup:
  Type: AWS::AutoScaling::AutoScalingGroup
  Properties:
    MinSize: 1
    MaxSize: 10
    DesiredCapacity: 2
    LaunchTemplate:
      LaunchTemplateName: web-server-template
    TargetGroupARNs:
      - !Ref TargetGroup
\`\`\`

#### 3. **S3 라이프사이클 정책**

\`\`\`json
{
  "Rules": [
    {
      "ID": "ArchiveOldLogs",
      "Status": "Enabled",
      "Transitions": [
        {
          "Days": 30,
          "StorageClass": "STANDARD_IA"
        },
        {
          "Days": 90,
          "StorageClass": "GLACIER"
        }
      ]
    }
  ]
}
\`\`\`

### 📊 예상 절약 효과

| 최적화 항목 | 월 절약액 | 연간 절약액 |
|-------------|-----------|-------------|
| EC2 인스턴스 다운사이징 | $200 | $2,400 |
| S3 스토리지 최적화 | $150 | $1,800 |
| 불필요한 리소스 제거 | $300 | $3,600 |
| **총 절약액** | **$650** | **$7,800** |

### 🔧 구현 스크립트

\`\`\`python
import boto3

def optimize_resources():
    """리소스 최적화 자동화"""
    ec2 = boto3.client('ec2')
    
    # 사용률이 낮은 인스턴스 찾기
    response = ec2.describe_instances(
        Filters=[
            {'Name': 'instance-state-name', 'Values': ['running']}
        ]
    )
    
    for reservation in response['Reservations']:
        for instance in reservation['Instances']:
            instance_id = instance['InstanceId']
            instance_type = instance['InstanceType']
            
            # CPU 사용률이 30% 미만인 인스턴스 식별
            if should_downgrade(instance_id, instance_type):
                print(f"다운그레이드 권장: {instance_id} ({instance_type})")

def should_downgrade(instance_id, current_type):
    """인스턴스 다운그레이드 필요성 판단"""
    # 실제로는 CloudWatch 메트릭을 확인해야 함
    return True  # 예시용

optimize_resources()
\`\`\`

> **🚀 다음 단계**: 위 스크립트를 실행하여 최적화를 시작할 수 있습니다.`
];


/**
 * Agent Service
 */
export const agentService = {
  /**
   * Send message to agent
   */
  sendMessage: async (request: AgentRequest): Promise<AgentResponse> => {
    try {
      // 실제 API 호출
      console.log('🚀 실제 Agent API 호출:', request.message);
      return await callAgentAPI(request.message);
    } catch (error) {
      console.error('API 호출 실패, Mock 데이터 사용:', error);
      // API 실패 시 Mock 응답 반환
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(getMockResponse(request.message));
        }, 1000);
      });
    }
  },

  /**
   * Get chat sessions
   */
  getSessions: (): Promise<ChatSession[]> => {
    return apiRequest.get<ChatSession[]>('/api/v1/agent/sessions');
  },

  /**
   * Get session by ID
   */
  getSession: (sessionId: string): Promise<ChatSession> => {
    return apiRequest.get<ChatSession>(`/api/v1/agent/sessions/${sessionId}`);
  },

  /**
   * Delete session
   */
  deleteSession: (sessionId: string): Promise<void> => {
    return apiRequest.delete<void>(`/api/v1/agent/sessions/${sessionId}`);
  },

  /**
   * Get suggested commands
   */
  getSuggestions: (): Promise<string[]> => {
    return apiRequest.get<string[]>('/api/v1/agent/suggestions');
  },
};

