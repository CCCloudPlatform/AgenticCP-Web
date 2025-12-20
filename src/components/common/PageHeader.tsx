import type { ReactNode } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subTitle?: string;
  showBack?: boolean;
  extra?: ReactNode;
  children?: ReactNode;
}

const PageHeader = ({ title, subTitle, showBack, extra, children }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        {showBack && (
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginRight: 16 }}
          />
        )}
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{title}</h2>
          {subTitle && (
            <div style={{ color: '#666', marginTop: 4 }}>{subTitle}</div>
          )}
        </div>
        {extra && <div>{extra}</div>}
      </div>
      {children}
    </div>
  );
};

export default PageHeader;

