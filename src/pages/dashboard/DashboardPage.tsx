import React from 'react';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">대시보드</h1>
        <p className="page-description">
          멀티 클라우드 플랫폼의 전체 현황을 한눈에 확인하세요
        </p>
        <div className="page-actions">
          <button className="btn-primary">새로고침</button>
          <button className="btn-secondary">설정</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              ☁️
            </div>
            <div className="stat-trend positive">
              <span>↗</span>
              <span>+12%</span>
            </div>
          </div>
          <div className="stat-value">156</div>
          <div className="stat-label">총 리소스</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              💰
            </div>
            <div className="stat-trend negative">
              <span>↘</span>
              <span>-5%</span>
            </div>
          </div>
          <div className="stat-value">1,234,567</div>
          <div className="stat-label">이번 달 비용 (원)</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              🔔
            </div>
            <div className="stat-trend positive">
              <span>↗</span>
              <span>+3</span>
            </div>
          </div>
          <div className="stat-value">12</div>
          <div className="stat-label">알림</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              ✅
            </div>
            <div className="stat-trend positive">
              <span>↗</span>
              <span>+0.2%</span>
            </div>
          </div>
          <div className="stat-value">98.5%</div>
          <div className="stat-label">정상 서비스</div>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">리소스 현황</h3>
            <div className="card-actions">
              <button className="btn-sm">전체보기</button>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-placeholder">
              <div className="chart-icon">📊</div>
              <p>차트가 여기에 표시됩니다</p>
              <small>리소스 사용량 및 분포를 시각화합니다</small>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">최근 활동</h3>
            <div className="card-actions">
              <button className="btn-sm">전체보기</button>
            </div>
          </div>
          <div className="card-content">
            <div className="activity-placeholder">
              <div className="activity-icon">📝</div>
              <p>최근 활동 내역이 여기에 표시됩니다</p>
              <small>시스템 이벤트 및 사용자 활동을 추적합니다</small>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">클라우드 프로바이더</h3>
          </div>
          <div className="card-content">
            <div className="provider-list">
              <div className="provider-item">
                <div className="provider-icon">☁️</div>
                <div className="provider-info">
                  <div className="provider-name">AWS</div>
                  <div className="provider-status">활성</div>
                </div>
              </div>
              <div className="provider-item">
                <div className="provider-icon">🔵</div>
                <div className="provider-info">
                  <div className="provider-name">Azure</div>
                  <div className="provider-status">활성</div>
                </div>
              </div>
              <div className="provider-item">
                <div className="provider-icon">🟢</div>
                <div className="provider-info">
                  <div className="provider-name">GCP</div>
                  <div className="provider-status">활성</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">보안 상태</h3>
          </div>
          <div className="card-content">
            <div className="security-status">
              <div className="security-item">
                <div className="security-icon">🔒</div>
                <div className="security-info">
                  <div className="security-name">보안 점수</div>
                  <div className="security-value">95/100</div>
                </div>
              </div>
              <div className="security-item">
                <div className="security-icon">🛡️</div>
                <div className="security-info">
                  <div className="security-name">위협 탐지</div>
                  <div className="security-value">0건</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <h3 className="card-title">성능 지표</h3>
          </div>
          <div className="card-content">
            <div className="performance-metrics">
              <div className="metric-item">
                <div className="metric-label">평균 응답시간</div>
                <div className="metric-value">120ms</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">가용성</div>
                <div className="metric-value">99.9%</div>
              </div>
              <div className="metric-item">
                <div className="metric-label">처리량</div>
                <div className="metric-value">1.2M req/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

