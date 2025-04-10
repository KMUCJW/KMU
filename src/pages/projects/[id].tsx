import { useRouter } from 'next/router';
import styled from 'styled-components';
import Image from 'next/image';
import { useState } from 'react';
import type { Project, Language } from '../../types';
import Head from 'next/head';

const Container = styled.div`
  min-height: 100vh;
  background: #000000;
  color: #ffffff;
  padding: 100px 20px 60px;
`;

const BackButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const MainImage = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 66.67%;
  margin-bottom: 40px;
`;

const ProjectInfo = styled.div`
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const InfoItem = styled.div`
  h2 {
    font-size: 14px;
    font-weight: normal;
    opacity: 0.5;
    margin-bottom: 8px;
  }
  p {
    font-size: 14px;
  }
`;

const Description = styled.div`
  font-size: 16px;
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 60px;
`;

const SubImagesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

const SubImageWrapper = styled.div`
  position: relative;
`;

const SubImage = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 66.67%;
  margin-bottom: 10px;
`;

const Caption = styled.p`
  font-size: 14px;
  opacity: 0.7;
  margin-top: 10px;
`;

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [language, setLanguage] = useState<Language>('kor');

  // 실제로는 API나 데이터베이스에서 프로젝트 데이터를 가져와야 합니다
  const project: Project | undefined = {
    id: 1,
    title: 'LX하우시스 2025 트렌드북',
    titleEng: 'LX Hausys 2025 Trendbook',
    image: '/images/projects/제목-없음2222-1.png',
    category: 'Editorial',
    year: 2025,
    client: 'LX하우시스',
    description: '프로젝트 설명입니다.',
    descriptionEng: 'Project description in English.',
    subImages: [
      {
        url: '/images/projects/제목-없음-1.png',
        caption: '이미지 설명',
        captionEng: 'Image caption in English'
      }
    ],
    credits: [
      { role: 'Design', name: 'ㅊㅈㅇ' }
    ],
    tags: ['Editorial', 'Book Design']
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{language === 'kor' ? project.title : project.titleEng} - ㅊㅈㅇ</title>
      </Head>
      <Container>
        <BackButton onClick={() => router.push('/')}>← Back</BackButton>
        <Content>
          <MainImage>
            <Image
              src={project.image}
              alt={language === 'kor' ? project.title : project.titleEng}
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </MainImage>
          
          <ProjectInfo>
            <Title>{language === 'kor' ? project.title : project.titleEng}</Title>
            <InfoGrid>
              <InfoItem>
                <h2>Year</h2>
                <p>{project.year}</p>
              </InfoItem>
              {project.client && (
                <InfoItem>
                  <h2>Client</h2>
                  <p>{project.client}</p>
                </InfoItem>
              )}
              <InfoItem>
                <h2>Category</h2>
                <p>{project.category}</p>
              </InfoItem>
              {project.credits && (
                <InfoItem>
                  <h2>Credits</h2>
                  {project.credits.map((credit, index) => (
                    <p key={index}>{credit.role}: {credit.name}</p>
                  ))}
                </InfoItem>
              )}
            </InfoGrid>
            
            {(project.description || project.descriptionEng) && (
              <Description>
                {language === 'kor' ? project.description : project.descriptionEng}
              </Description>
            )}
          </ProjectInfo>

          {project.subImages && project.subImages.length > 0 && (
            <SubImagesGrid>
              {project.subImages.map((subImage, index) => (
                <SubImageWrapper key={index}>
                  <SubImage>
                    <Image
                      src={subImage.url}
                      alt={language === 'kor' ? subImage.caption || '' : subImage.captionEng || ''}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </SubImage>
                  {(subImage.caption || subImage.captionEng) && (
                    <Caption>
                      {language === 'kor' ? subImage.caption : subImage.captionEng}
                    </Caption>
                  )}
                </SubImageWrapper>
              ))}
            </SubImagesGrid>
          )}
        </Content>
      </Container>
    </>
  );
} 