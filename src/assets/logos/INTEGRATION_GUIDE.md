/**
 * AgenticCP Logo Integration Guide
 * 
 * 프로젝트에 로고가 성공적으로 통합되었습니다.
 * 다음과 같은 위치에서 로고를 사용할 수 있습니다:
 */

// 1. Header 컴포넌트 (가로형 로고)
import Logo from '@/components/common/Logo';

<Logo 
  variant="horizontal" 
  width={200} 
  height={50} 
  className="header-logo"
  alt="AgenticCP Logo"
/>

// 2. Sidebar 컴포넌트 (반응형 로고)
{collapsed ? (
  <Logo 
    variant="square" 
    width={40} 
    height={40} 
    className="sidebar-logo-collapsed"
    alt="AgenticCP Logo"
  />
) : (
  <Logo 
    variant="horizontal" 
    width={180} 
    height={45} 
    className="sidebar-logo-expanded"
    alt="AgenticCP Logo"
  />
)}

// 3. 프레젠테이션용 로고 (애니메이션 + 글로우)
<Logo 
  variant="horizontal" 
  width={300} 
  height={100} 
  animated={true}
  glow={true}
  className="presentation-logo"
  alt="AgenticCP Logo"
/>

// 4. 소셜 미디어용 로고
<Logo 
  variant="square" 
  width={120} 
  height={120} 
  glow={true}
  className="social-logo"
  alt="AgenticCP Logo"
/>

/**
 * 사용 가능한 Props:
 * - variant: 'horizontal' | 'square'
 * - width?: number
 * - height?: number
 * - className?: string
 * - alt?: string
 * - animated?: boolean (애니메이션 효과)
 * - glow?: boolean (글로우 효과)
 */

/**
 * CSS 클래스:
 * - .agenticcp-logo: 기본 로고 스타일
 * - .agenticcp-logo--horizontal: 가로형 로고
 * - .agenticcp-logo--square: 정사각형 로고
 * - .agenticcp-logo--animated: 펄스 애니메이션
 * - .agenticcp-logo--glow: 글로우 효과
 * - .header-logo: 헤더용 로고 스타일
 * - .sidebar-logo-collapsed: 접힌 사이드바용
 * - .sidebar-logo-expanded: 펼쳐진 사이드바용
 */
