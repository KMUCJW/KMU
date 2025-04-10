import { motion } from 'framer-motion';
import styled from 'styled-components';
import { useState } from 'react';
import type { Project, Language } from '../types';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Container = styled.div`
  min-height: 100vh;
  background: #000000;
`;

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 100;
  background: transparent;
`;

const Logo = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  height: 30px;
  width: 200px;
  cursor: pointer;
  z-index: 101;
  display: flex;
  align-items: center;
  mix-blend-mode: difference;

  img {
    object-fit: contain !important;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 30px;
  font-size: 14px;
`;

const NavLink = styled.a`
  color: #ffffff;
  opacity: 0.5;
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  &:hover {
    opacity: 1;
  }
`;

const CategoryNav = styled.nav`
  position: fixed;
  top: 70px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
  mix-blend-mode: difference;
`;

const CategoryLink = styled.button<{ isActive: boolean }>`
  color: #ffffff;
  opacity: ${props => props.isActive ? 1 : 0.5};
  cursor: pointer;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  text-align: left;
  font-family: inherit;
  &:hover {
    opacity: 1;
  }
`;

const Main = styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  width: 100%;
  padding-top: 60px;
  gap: 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  cursor: pointer;
  overflow: hidden;
`;

const ProjectImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const ProjectTitle = styled(motion.div)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-size: 14px;
  opacity: 0;
  text-align: center;
  z-index: 2;
  width: 80%;
`;

const ProjectOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  z-index: 1;
`;

export default function Home() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('kor');
  const [selectedCategory, setSelectedCategory] = useState<string>('All types');
  
  const projects: Project[] = [
    { 
      id: 1, 
      title: 'LX하우시스 2025 트렌드북',
      titleEng: 'LX Hausys 2025 Trendbook',
      image: '/images/projects/제목-없음2222-1.png',
      category: 'Editorial',
      year: 2025,
      client: 'LX하우시스'
    },
    { 
      id: 2, 
      title: '시대 정신 프로젝트',
      titleEng: 'The Zeitgeist Project',
      image: '/images/projects/제목-없음-1.png',
      category: 'Website',
      year: 2025,
      client: '일상의실천'
    },
    { 
      id: 3, 
      title: '불온한 인권',
      titleEng: 'Subversive Rights',
      image: '/images/projects/사진작가.png',
      category: 'Editorial',
      year: 2024
    },
    { 
      id: 4, 
      title: '더코너즈 건축사사무소 아이덴티티 디자인',
      titleEng: 'The Cornerz Identity Design',
      image: '/images/projects/스크린샷 2025-03-10 오전 1.45.49.png',
      category: 'Identity',
      year: 2024
    },
    { 
      id: 5, 
      title: '나비클럽 소설선 『타오』',
      titleEng: 'Nabi Club Novel Series "THAO"',
      image: '/images/projects/몬드리안포스터-2.png',
      category: 'Editorial',
      year: 2024
    },
    { 
      id: 6, 
      title: '모두예술극장 기획 프로그램',
      titleEng: 'Modu Art Theater Program',
      image: '/images/projects/네브포스터.png',
      category: 'Graphic',
      year: 2024
    }
  ];

  const filteredProjects = projects.filter(project => 
    selectedCategory === 'All types' || project.category === selectedCategory
  );

  const handleProjectClick = (projectId: number) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      <Head>
        <title>ㅊㅈㅇ</title>
        <meta name="description" content="ㅊㅈㅇ" />
      </Head>
      <Container>
        <Logo>
          <Image
            src="/images/projects/logo.png"
            alt="ㅊㅈㅇ"
            fill
            priority
          />
        </Logo>
        <Header>
          <Nav>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <NavLink 
              as="button" 
              onClick={() => setLanguage(lang => lang === 'kor' ? 'eng' : 'kor')}
            >
              {language === 'kor' ? 'ENG' : '한국어'}
            </NavLink>
          </Nav>
        </Header>
        <CategoryNav>
          {['All types', 'Graphic', 'Identity', 'Motion/Video'].map(category => (
            <CategoryLink
              key={category}
              isActive={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </CategoryLink>
          ))}
        </CategoryNav>
        <Main>
          {filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id}
              whileHover="hover"
              onClick={() => handleProjectClick(project.id)}
            >
              <ProjectImageWrapper>
                <Image
                  src={project.image}
                  alt={language === 'kor' ? project.title : project.titleEng || project.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={project.id <= 4}
                />
              </ProjectImageWrapper>
              <ProjectTitle
                variants={{
                  hover: { opacity: 1 }
                }}
              >
                {language === 'kor' ? project.title : project.titleEng || project.title}
              </ProjectTitle>
              <ProjectOverlay
                variants={{
                  hover: { opacity: 1 }
                }}
              />
            </ProjectCard>
          ))}
        </Main>
      </Container>
    </>
  );
} 