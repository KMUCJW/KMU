import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import { projects } from '../data/projects';
import type { Language, Project } from '../types';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const UploadButton = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #007AFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled.div`
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 75%;
  overflow: hidden;
  border-radius: 8px;
`;

const Title = styled.h3`
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 500;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const CategoryButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isSelected'].includes(prop),
})<{ isSelected: boolean }>`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.isSelected ? '#000' : '#ddd'};
  border-radius: 20px;
  background: ${props => props.isSelected ? '#000' : 'transparent'};
  color: ${props => props.isSelected ? '#fff' : '#000'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #000;
  }
`;

const LanguageToggle = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  
  &:hover {
    border-color: #000;
  }
`;

export default function Home() {
  const [language, setLanguage] = useState<Language>('ko');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const categories = ['All', ...Array.from(new Set(projects.map(project => project.category)))];
  
  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data.url);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Container>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Welcome to my portfolio" />
      </Head>

      <Header>
        <LanguageToggle onClick={toggleLanguage}>
          {language === 'ko' ? 'English' : '한국어'}
        </LanguageToggle>

        <UploadButton>
          이미지 업로드
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </UploadButton>
      </Header>

      <CategoryFilter>
        {categories.map(category => (
          <CategoryButton
            key={category}
            isSelected={category === selectedCategory}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoryFilter>

      <Grid>
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id}>
            <ImageWrapper>
              <Image
                src={`/images/projects/${project.image}`}
                alt={language === 'ko' ? project.title : project.titleEng}
                fill
                style={{ objectFit: 'cover' }}
              />
            </ImageWrapper>
            <Title>
              {language === 'ko' ? project.title : project.titleEng}
            </Title>
          </ProjectCard>
        ))}
      </Grid>
    </Container>
  );
} 