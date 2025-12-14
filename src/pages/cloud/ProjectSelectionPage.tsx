import React, { useState, useEffect } from 'react';
import { Card, Typography, Tag, Badge, Avatar } from 'antd';
import { CloudServerOutlined, DatabaseOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { projectService } from '@/services/projectService';
import { Project } from '@/types';
import './ProjectSelectionPage.scss';

const { Title, Text } = Typography;

const ProjectSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.content);
    } catch (error) {
      console.error('프로젝트 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId: number) => {
    navigate(`/cloud/project-resources?projectId=${projectId}`);
  };

  const getProviderIcon = (providerName: string) => {
    switch (providerName.toLowerCase()) {
      case 'aws':
        return '🟠';
      case 'gcp':
        return '🔵';
      case 'azure':
        return '🔷';
      default:
        return '☁️';
    }
  };

  const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
      case 'server':
        return <CloudServerOutlined />;
      case 'storage':
        return <DatabaseOutlined />;
      case 'network':
        return <GlobalOutlined />;
      default:
        return <PlusOutlined />;
    }
  };

  return (
    <div className="project-selection-page">
      {/* 페이지 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <Title level={1} className="page-title">
              프로젝트별 리소스 생성
            </Title>
            <Text className="page-description">
              프로젝트를 선택하여 해당 프로젝트에 리소스를 생성하세요.
            </Text>
          </div>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="projects-grid">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="project-card"
            onClick={() => handleProjectClick(project.id)}
            hoverable
          >
            <div className="project-header">
              <div className="project-info">
                <div className="project-title">
                  <Avatar size="large" className="project-avatar">
                    {getProviderIcon(project.provider.name)}
                  </Avatar>
                  <div className="project-details">
                    <Title level={4} className="project-name">
                      {project.name}
                    </Title>
                    <Text type="secondary" className="project-organization">
                      {project.organization.name}
                    </Text>
                  </div>
                </div>
                <div className="project-stats">
                  <Badge count={project.resources.length} showZero color="var(--color-primary)">
                    <Tag color="blue">리소스</Tag>
                  </Badge>
                </div>
              </div>
            </div>

            <div className="project-description">
              <Text type="secondary">
                {project.provider.name} 클라우드 환경에서 {project.organization.name}의
                프로젝트입니다.
              </Text>
            </div>

            {/* 리소스 요약 */}
            <div className="project-resources-summary">
              <div className="summary-item">
                <CloudServerOutlined className="summary-icon server" />
                <div className="summary-content">
                  <Text className="summary-label">서버</Text>
                  <Text className="summary-count">
                    {
                      project.resources.filter((r) =>
                        ['EC2', 'Compute Engine', 'Virtual Machine', 'VM'].includes(r.type)
                      ).length
                    }
                  </Text>
                </div>
              </div>
              <div className="summary-item">
                <DatabaseOutlined className="summary-icon storage" />
                <div className="summary-content">
                  <Text className="summary-label">스토리지</Text>
                  <Text className="summary-count">
                    {
                      project.resources.filter((r) =>
                        ['S3', 'Cloud Storage', 'Blob Storage', 'Storage'].includes(r.type)
                      ).length
                    }
                  </Text>
                </div>
              </div>
              <div className="summary-item">
                <GlobalOutlined className="summary-icon network" />
                <div className="summary-content">
                  <Text className="summary-label">네트워크</Text>
                  <Text className="summary-count">
                    {
                      project.resources.filter((r) =>
                        ['VPC', 'Virtual Network', 'VNet', 'Network'].includes(r.type)
                      ).length
                    }
                  </Text>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="project-actions">
              <Text type="secondary" className="action-hint">
                클릭하여 리소스 관리
              </Text>
            </div>
          </Card>
        ))}
      </div>

      {/* 프로젝트가 없는 경우 */}
      {projects.length === 0 && !loading && (
        <Card className="empty-state">
          <div className="empty-content">
            <Title level={3}>프로젝트가 없습니다</Title>
            <Text type="secondary">먼저 프로젝트를 생성해주세요.</Text>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate(ROUTES.PROJECT)}
              className="create-project-btn"
            >
              프로젝트 생성하기
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ProjectSelectionPage;
