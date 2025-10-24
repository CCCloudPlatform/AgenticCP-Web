import React from 'react';
import { LogoProps } from '@/assets/logos';

/**
 * AgenticCP Logo Component
 * 
 * 모듈러 기하학적 디자인의 멀티클라우드 플랫폼 로고
 * 가로형과 정사각형 두 가지 버전 제공
 */
const Logo: React.FC<LogoProps> = ({ 
  variant, 
  width, 
  height, 
  className = '', 
  alt = 'AgenticCP Logo',
  animated = false,
  glow = false
}) => {
  const logoPath = variant === 'horizontal' 
    ? '/src/assets/logos/AgenticCP-logo-horizontal.svg'
    : '/src/assets/logos/AgenticCP-logo-square.svg';

  const defaultSize = variant === 'horizontal' 
    ? { width: 200, height: 60 }
    : { width: 80, height: 80 };

  const logoClasses = [
    'agenticcp-logo',
    `agenticcp-logo--${variant}`,
    animated ? 'agenticcp-logo--animated' : '',
    glow ? 'agenticcp-logo--glow' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <img
      src={logoPath}
      alt={alt}
      width={width || defaultSize.width}
      height={height || defaultSize.height}
      className={logoClasses}
      style={{
        display: 'block',
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  );
};

export default Logo;
