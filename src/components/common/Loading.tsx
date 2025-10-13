import { Spin } from 'antd';

interface LoadingProps {
  tip?: string;
  fullscreen?: boolean;
}

const Loading = ({ tip = '로딩 중...', fullscreen = false }: LoadingProps) => {
  const style = fullscreen
    ? { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }
    : { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' };

  return (
    <div style={style}>
      <Spin tip={tip} size="large" />
    </div>
  );
};

export default Loading;

