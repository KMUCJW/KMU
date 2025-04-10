import { NextPage } from 'next';
import Head from 'next/head';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <>
      <Head>
        <title>Error - Portfolio</title>
      </Head>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#000000',
        color: '#ffffff',
      }}>
        <h1 style={{ marginBottom: '20px' }}>
          {statusCode
            ? `서버 오류 ${statusCode}가 발생했습니다`
            : '클라이언트 오류가 발생했습니다'}
        </h1>
        <button 
          onClick={() => window.location.href = '/'}
          style={{
            background: 'transparent',
            border: '1px solid #ffffff',
            color: '#ffffff',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          홈으로 돌아가기
        </button>
      </div>
    </>
  );
};

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 