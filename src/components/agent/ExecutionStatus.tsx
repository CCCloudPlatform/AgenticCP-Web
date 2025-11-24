import { Steps, Tag, Space, Typography } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ExecutionStep } from '@/store/agentChatStore';
import './ExecutionStatus.scss';

const { Text } = Typography;

interface ExecutionStatusProps {
  currentStep: ExecutionStep;
  steps?: ExecutionStep[];
  context?: {
    tool?: string;
    endpoint?: string;
    duration?: number;
  };
}

const stepLabels: Record<ExecutionStep, string> = {
  thinking: '생각 중',
  analyzing: '분석 중',
  fetching: '데이터 수집 중',
  processing: '처리 중',
  executing: '실행 중',
  rendering: '결과 생성 중',
  completed: '완료',
  error: '오류',
};

const stepIcons: Record<ExecutionStep, React.ReactNode> = {
  thinking: <LoadingOutlined spin style={{ color: '#6366f1' }} />,
  analyzing: <LoadingOutlined spin style={{ color: '#8b5cf6' }} />,
  fetching: <LoadingOutlined spin style={{ color: '#06b6d4' }} />,
  processing: <LoadingOutlined spin style={{ color: '#10b981' }} />,
  executing: <LoadingOutlined spin style={{ color: '#f59e0b' }} />,
  rendering: <LoadingOutlined spin style={{ color: '#6366f1' }} />,
  completed: <CheckCircleOutlined style={{ color: '#10b981' }} />,
  error: <CloseCircleOutlined style={{ color: '#ef4444' }} />,
};

const ExecutionStatus: React.FC<ExecutionStatusProps> = ({ 
  currentStep, 
  steps,
  context 
}) => {
  const defaultSteps: ExecutionStep[] = [
    'thinking',
    'analyzing',
    'fetching',
    'processing',
    'executing',
    'rendering',
    'completed',
  ];

  const executionSteps = steps || defaultSteps;
  const currentIndex = executionSteps.indexOf(currentStep);
  const isError = currentStep === 'error';
  const isCompleted = currentStep === 'completed';
  
  // currentIndex가 유효하지 않으면 0으로 설정
  const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="execution-status">
      <div className="execution-header">
        <Space>
          {stepIcons[currentStep]}
          <Text strong style={{ fontSize: 14 }}>
            {stepLabels[currentStep]}
          </Text>
          {context?.tool && (
            <Tag color="blue" style={{ marginLeft: 8 }}>
              {context.tool}
            </Tag>
          )}
          {context?.duration && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {context.duration}ms
            </Text>
          )}
        </Space>
      </div>

      {executionSteps.length > 1 && (
        <Steps
          direction="vertical"
          current={isError ? -1 : safeCurrentIndex}
          status={isError ? 'error' : isCompleted ? 'finish' : 'process'}
          size="small"
          className="execution-steps"
        >
          {executionSteps.slice(0, -1).map((step, index) => {
            // slice(0, -1)로 마지막 'completed'를 제외하므로, 표시되는 단계는 0부터 (executionSteps.length - 2)까지
            const displayedStepsCount = executionSteps.length - 1; // slice(0, -1)의 결과 길이
            // 'completed' 상태일 때는 safeCurrentIndex가 마지막 인덱스(executionSteps.length - 1)이므로
            // 모든 표시된 단계가 완료되어야 함
            const effectiveCurrentIndex = isCompleted ? displayedStepsCount : safeCurrentIndex;
            const isActive = index === safeCurrentIndex && !isCompleted && safeCurrentIndex < displayedStepsCount;
            // 완료 상태일 때는 모든 표시된 단계가 완료되어야 함
            const isFinished = index < effectiveCurrentIndex || (isCompleted && index < displayedStepsCount);
            const isPending = index > safeCurrentIndex && !isCompleted;

            return (
              <Steps.Step
                key={step}
                title={
                  <div className="step-title-wrapper">
                    <span>{stepLabels[step]}</span>
                    {/* 진행 중 프로그레스 바 */}
                    {isActive && (
                      <div className="step-progress-bar">
                        <div className="step-progress-fill" />
                      </div>
                    )}
                    {/* 완료 프로그레스 바 (완료 애니메이션 후) */}
                    {isFinished && (
                      <div className="step-progress-bar step-progress-complete">
                        <div className="step-progress-fill step-progress-fill-complete" />
                      </div>
                    )}
                  </div>
                }
                description={
                  isActive && context?.duration ? (
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {context.duration.toFixed(0)}ms
                    </Text>
                  ) : undefined
                }
                icon={
                  <div className={`step-icon-wrapper ${isFinished ? 'step-complete' : ''} ${isActive ? 'step-active' : isPending ? 'step-pending' : ''}`}>
                    {isActive ? (
                      <span className="active-step-icon">
                        {stepIcons[step]}
                      </span>
                    ) : isFinished ? (
                      <CheckCircleOutlined className="check-icon" style={{ color: '#ffffff', fontSize: 16 }} />
                    ) : (
                      <div className="pending-icon-placeholder" />
                    )}
                  </div>
                }
              />
            );
          })}
        </Steps>
      )}

      {context?.endpoint && (
        <div className="execution-context">
          <Text type="secondary" style={{ fontSize: 11, fontFamily: 'monospace' }}>
            {context.endpoint}
          </Text>
        </div>
      )}
    </div>
  );
};

export default ExecutionStatus;
