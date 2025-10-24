import React, { useEffect } from 'react';
import { Card, Button, Space, Alert, Spin, Typography, Divider } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useTenantStore } from '@/store/tenantStore';
import ProtectedComponent from '@/components/common/ProtectedComponent';
import ProtectedButton from '@/components/common/ProtectedButton';
import './PermissionTestPage.scss';

const { Title, Text, Paragraph } = Typography;

/**
 * Permission Test Page
 * 개발자를 위한 권한 검증 테스트 페이지
 */
const PermissionTestPage: React.FC = () => {
  const { 
    user, 
    isAuthenticated, 
    userPermissions, 
    userRoles, 
    permissionLoading, 
    permissionError,
    refreshPermissions,
    refreshRoles 
  } = useAuth();
  
  const { 
    hasPermission, 
    hasRole, 
    canRead, 
    canWrite, 
    canDelete,
    isLoading 
  } = usePermission();
  
  const { currentTenant, initTenant } = useTenantStore();

  useEffect(() => {
    if (isAuthenticated) {
      initTenant();
      refreshPermissions();
      refreshRoles();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="permission-test-page">
        <Alert 
          message="인증 필요" 
          description="권한 테스트를 위해 먼저 로그인해주세요." 
          type="warning" 
        />
      </div>
    );
  }

  return (
    <div className="permission-test-page">
      <Title level={2}>🔐 권한 검증 테스트 페이지</Title>
      <Paragraph>
        이 페이지는 권한 검증 시스템의 동작을 테스트하기 위한 개발자용 페이지입니다.
      </Paragraph>

      {permissionLoading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Spin size="large" />
          <Text>권한 정보를 불러오는 중...</Text>
        </div>
      )}

      {permissionError && (
        <Alert 
          message="권한 정보 로드 실패" 
          description={permissionError} 
          type="error" 
          style={{ marginBottom: 20 }}
        />
      )}

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 사용자 정보 */}
        <Card title="👤 사용자 정보" size="small">
          <Space direction="vertical">
            <Text><strong>사용자명:</strong> {user?.username}</Text>
            <Text><strong>이메일:</strong> {user?.email}</Text>
            <Text><strong>역할:</strong> {user?.role}</Text>
            <Text><strong>상태:</strong> {user?.status}</Text>
          </Space>
        </Card>

        {/* 테넌트 정보 */}
        <Card title="🏢 테넌트 정보" size="small">
          <Space direction="vertical">
            <Text><strong>테넌트 키:</strong> {currentTenant.tenantKey}</Text>
            <Text><strong>테넌트명:</strong> {currentTenant.tenantName}</Text>
          </Space>
        </Card>

        {/* 권한 목록 */}
        <Card title="🔑 사용자 권한 목록" size="small">
          {userPermissions.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {userPermissions.map((permission, index) => (
                <Button key={index} size="small" type="outline">
                  {permission}
                </Button>
              ))}
            </div>
          ) : (
            <Text type="secondary">권한 정보가 없습니다.</Text>
          )}
        </Card>

        {/* 역할 목록 */}
        <Card title="🎭 사용자 역할 목록" size="small">
          {userRoles.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {userRoles.map((role, index) => (
                <Button key={index} size="small" type="primary">
                  {role}
                </Button>
              ))}
            </div>
          ) : (
            <Text type="secondary">역할 정보가 없습니다.</Text>
          )}
        </Card>

        <Divider />

        {/* 권한 검증 테스트 */}
        <Card title="🧪 권한 검증 테스트" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            
            {/* 기본 권한 검증 */}
            <div>
              <Title level={4}>기본 권한 검증</Title>
              <Space wrap>
                <Button 
                  onClick={() => console.log('user.read 권한:', hasPermission('user.read'))}
                >
                  user.read 권한 확인
                </Button>
                <Button 
                  onClick={() => console.log('user.write 권한:', hasPermission('user.write'))}
                >
                  user.write 권한 확인
                </Button>
                <Button 
                  onClick={() => console.log('admin 권한:', hasPermission('admin'))}
                >
                  admin 권한 확인
                </Button>
              </Space>
            </div>

            {/* 역할 검증 */}
            <div>
              <Title level={4}>역할 검증</Title>
              <Space wrap>
                <Button 
                  onClick={() => console.log('SUPER_ADMIN 역할:', hasRole('SUPER_ADMIN'))}
                >
                  SUPER_ADMIN 역할 확인
                </Button>
                <Button 
                  onClick={() => console.log('관리자 역할들:', hasRole(['SUPER_ADMIN', 'TENANT_ADMIN']))}
                >
                  관리자 역할들 확인
                </Button>
              </Space>
            </div>

            {/* 리소스별 권한 검증 */}
            <div>
              <Title level={4}>리소스별 권한 검증</Title>
              <Space wrap>
                <Button 
                  onClick={() => console.log('사용자 읽기:', canRead('user'))}
                >
                  사용자 읽기 권한
                </Button>
                <Button 
                  onClick={() => console.log('사용자 쓰기:', canWrite('user'))}
                >
                  사용자 쓰기 권한
                </Button>
                <Button 
                  onClick={() => console.log('사용자 삭제:', canDelete('user'))}
                >
                  사용자 삭제 권한
                </Button>
              </Space>
            </div>
          </Space>
        </Card>

        <Divider />

        {/* ProtectedComponent 테스트 */}
        <Card title="🛡️ ProtectedComponent 테스트" size="small">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            
            <div>
              <Text strong>user.read 권한이 있는 경우에만 표시:</Text>
              <ProtectedComponent permission="user.read">
                <Alert message="✅ user.read 권한이 있습니다!" type="success" />
              </ProtectedComponent>
              <ProtectedComponent permission="user.read" fallback={
                <Alert message="❌ user.read 권한이 없습니다." type="error" />
              }>
                <Alert message="✅ user.read 권한이 있습니다!" type="success" />
              </ProtectedComponent>
            </div>

            <div>
              <Text strong>SUPER_ADMIN 역할이 있는 경우에만 표시:</Text>
              <ProtectedComponent role="SUPER_ADMIN">
                <Alert message="✅ SUPER_ADMIN 역할이 있습니다!" type="success" />
              </ProtectedComponent>
              <ProtectedComponent role="SUPER_ADMIN" fallback={
                <Alert message="❌ SUPER_ADMIN 역할이 없습니다." type="error" />
              }>
                <Alert message="✅ SUPER_ADMIN 역할이 있습니다!" type="success" />
              </ProtectedComponent>
            </div>
          </Space>
        </Card>

        {/* ProtectedButton 테스트 */}
        <Card title="🔘 ProtectedButton 테스트" size="small">
          <Space wrap>
            <ProtectedButton 
              permission="user.create" 
              type="primary"
              disabledText="사용자 생성 권한이 필요합니다"
            >
              사용자 생성
            </ProtectedButton>
            
            <ProtectedButton 
              role="SUPER_ADMIN" 
              type="primary"
              disabledText="SUPER_ADMIN 역할이 필요합니다"
            >
              관리자 기능
            </ProtectedButton>
            
            <ProtectedButton 
              permission="user.delete" 
              danger
              disabledText="사용자 삭제 권한이 필요합니다"
            >
              사용자 삭제
            </ProtectedButton>
          </Space>
        </Card>

        {/* 새로고침 버튼 */}
        <Card title="🔄 새로고침" size="small">
          <Space>
            <Button onClick={refreshPermissions} loading={isLoading}>
              권한 새로고침
            </Button>
            <Button onClick={refreshRoles} loading={isLoading}>
              역할 새로고침
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default PermissionTestPage;
