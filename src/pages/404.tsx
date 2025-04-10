import { NextPage } from 'next';
import Head from 'next/head';

const NotFound: NextPage = () => {
  return (
    <>
      <Head>
        <title>404 - Portfolio</title>
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
        <h1 style={{ marginBottom: '20px' }}>404 - 페이지를 찾을 수 없습니다</h1>
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

export default NotFound; 