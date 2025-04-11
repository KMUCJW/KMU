import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styled from 'styled-components';
import { projects } from '../data/projects';
import type { Category, Language, Project } from '../types';

const Container = styled.div`
  min-height: 100vh;
  background-color: #000;
  color: #fff;
  display: flex;
`;

const Sidebar = styled.div`
  width: 300px;
  padding: 40px;
  border-right: 1px solid #333;
  position: fixed;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  font-size: 24px;
  margin-bottom: 60px;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: auto;
`;

const CategoryItem = styled.div<{ active: boolean }>`
  font-size: 18px;
  cursor: pointer;
  color: ${props => props.active ? '#fff' : '#666'};
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: auto;
`;

const NavLink = styled.a`
  color: #666;
  text-decoration: none;
  font-size: 18px;
  transition: color 0.3s;

  &:hover {
    color: #fff;
  }
`;

const MainContent = styled.main`
  margin-left: 300px;
  flex: 1;
  padding: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
`;

const ProjectCard = styled.div`
  position: relative;
  cursor: pointer;
  aspect-ratio: 1;
  overflow: hidden;
`;

const ProjectImage = styled(Image)`
  object-fit: cover;
  transition: transform 0.3s;

  ${ProjectCard}:hover & {
    transform: scale(1.05);
  }
`;

const ProjectInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  opacity: 0;
  transition: opacity 0.3s;

  ${ProjectCard}:hover & {
    opacity: 1;
  }
`;

const ProjectTitle = styled.h3`
  margin: 0;
  font-size: 18px;
`;

const ProjectYear = styled.div`
  font-size: 14px;
  color: #999;
  margin-top: 5px;
`;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All types');
  const [language, setLanguage] = useState<Language>('ko');

  const filteredProjects = selectedCategory === 'All types'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Container>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Welcome to my portfolio" />
      </Head>

      <Sidebar>
        <Logo>ㅊㅈㅇ</Logo>
        <CategoryList>
          {(['All types', 'Graphic', 'Identity', 'Motion/Video'] as Category[]).map((category) => (
            <CategoryItem
              key={category}
              active={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryItem>
          ))}
        </CategoryList>
        <NavLinks>
          <NavLink href="#about">About</NavLink>
          <NavLink href="#contact">Contact</NavLink>
        </NavLinks>
      </Sidebar>

      <MainContent>
        <Grid>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectImage
                src={`/images/projects/${project.image}`}
                alt={language === 'ko' ? project.title : project.titleEng}
                fill
              />
              <ProjectInfo>
                <ProjectTitle>
                  {language === 'ko' ? project.title : project.titleEng}
                </ProjectTitle>
                <ProjectYear>{project.year}</ProjectYear>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </Grid>
      </MainContent>
    </Container>
  );
} 