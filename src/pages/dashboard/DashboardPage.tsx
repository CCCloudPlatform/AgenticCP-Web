import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  CloudOutlined,
  DollarOutlined,
  AlertOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import './DashboardPage.scss';

const { Title } = Typography;

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <Title level={2}>대시보드</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="총 리소스"
              value={156}
              prefix={<CloudOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="이번 달 비용"
              value={1234567}
              prefix={<DollarOutlined />}
              suffix="원"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="알림"
              value={12}
              prefix={<AlertOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="정상 서비스"
              value={98.5}
              prefix={<CheckCircleOutlined />}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="리소스 현황">
            <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p>차트가 여기에 표시됩니다</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="최근 활동">
            <div style={{ height: 300 }}>
              <p>최근 활동 내역이 여기에 표시됩니다</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;

