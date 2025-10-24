/**
 * AgenticCP Logo Assets - Quantum Neural Cloud Architecture
 * 
 * 심오한 철학과 기술적 혁신을 담은 멀티클라우드 플랫폼 로고
 * - 가로형: 헤더, 네비게이션, 프레젠테이션용
 * - 정사각형: 파비콘, 앱 아이콘, 소셜 미디어용
 * 
 * 디자인 철학: 양자적 연결성, 신경망 의식, 궤도적 클라우드 레이어
 */

// 로고 파일 경로 상수
export const LOGO_PATHS = {
  HORIZONTAL: '/src/assets/logos/AgenticCP-logo-horizontal.svg',
  SQUARE: '/src/assets/logos/AgenticCP-logo-square.svg',
} as const;

// 로고 사용 가이드
export const LOGO_GUIDE = {
  // 최소 크기 (품질 유지)
  MIN_SIZE: {
    HORIZONTAL: { width: 180, height: 60 },
    SQUARE: { width: 60, height: 60 },
  },
  // 권장 크기 (최적 품질)
  RECOMMENDED_SIZE: {
    HORIZONTAL: { width: 320, height: 80 },
    SQUARE: { width: 100, height: 100 },
  },
  // 최대 크기 (고해상도)
  MAX_SIZE: {
    HORIZONTAL: { width: 640, height: 160 },
    SQUARE: { width: 200, height: 200 },
  },
  // 색상 팔레트 (양자 필드 그라데이션)
  QUANTUM_COLORS: {
    PRIMARY: '#6366f1',      // 양자 코어
    SECONDARY: '#8b5cf6',    // 신경 경로
    ACCENT: '#a855f7',       // 데이터 스트림
    NEURAL: '#06b6d4',       // 신경망 연결
    DATA_FLOW: '#3b82f6',    // 정보 흐름
  },
  // 애니메이션 설정
  ANIMATION: {
    PULSE_DURATION: '3s',
    ORBIT_DURATION: '8s',
    DATA_FLOW_DURATION: '4s',
  },
} as const;

// 로고 컴포넌트 타입
export interface LogoProps {
  variant: 'horizontal' | 'square';
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  animated?: boolean;
  glow?: boolean;
}

// 로고 사용 시나리오
export const LOGO_USAGE = {
  HEADER: {
    variant: 'horizontal' as const,
    size: { width: 280, height: 70 },
    animated: false,
    glow: true,
  },
  FAVICON: {
    variant: 'square' as const,
    size: { width: 32, height: 32 },
    animated: false,
    glow: false,
  },
  PRESENTATION: {
    variant: 'horizontal' as const,
    size: { width: 400, height: 100 },
    animated: true,
    glow: true,
  },
  SOCIAL_MEDIA: {
    variant: 'square' as const,
    size: { width: 120, height: 120 },
    animated: false,
    glow: true,
  },
} as const;
