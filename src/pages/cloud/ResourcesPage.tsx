import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResourcesPage.scss';

const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 프로젝트 선택 페이지로 리다이렉트
    navigate('/cloud/project-selection');
  }, [navigate]);

  return null;
};

export default ResourcesPage;
