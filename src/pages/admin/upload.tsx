import { useState, useRef } from 'react';
import styled from 'styled-components';
import type { Project } from '../../types';
import Head from 'next/head';
import Image from 'next/image';

const Container = styled.div`
  min-height: 100vh;
  background: #000000;
  color: #ffffff;
  padding: 60px 20px;
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: normal;
  margin-bottom: 40px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: normal;
  margin-bottom: 10px;
`;

const Input = styled.input`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #ffffff;
  }
`;

const TextArea = styled.textarea`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #ffffff;
  }
`;

const Select = styled.select`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px;
  color: #ffffff;
  font-size: 14px;
  width: 100%;
  &:focus {
    outline: none;
    border-color: #ffffff;
  }
  option {
    background: #000000;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 66.67%;
  margin-top: 10px;
  background: rgba(255, 255, 255, 0.1);
`;

const SubImagesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const SubImageItem = styled.div`
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: #ffffff;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const SubmitButton = styled.button`
  background: #ffffff;
  color: #000000;
  border: none;
  padding: 15px 30px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
`;

interface SubImage {
  file: File;
  preview: string;
  caption?: string;
  captionEng?: string;
}

export default function Upload() {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [subImages, setSubImages] = useState<SubImage[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setSubImages(prev => [...prev, ...newImages]);
    }
  };

  const handleDeleteSubImage = (index: number) => {
    setSubImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);

    // Add main image
    if (mainImage) {
      formData.set('mainImage', mainImage);
    }

    // Add sub images
    subImages.forEach((image, index) => {
      formData.append(`subImages`, image.file);
      if (image.caption) formData.append(`subImageCaption${index}`, image.caption);
      if (image.captionEng) formData.append(`subImageCaptionEng${index}`, image.captionEng);
    });

    try {
      const response = await fetch('/api/projects/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      alert('프로젝트가 성공적으로 업로드되었습니다.');
      // Reset form
      e.currentTarget.reset();
      setMainImage(null);
      setMainImagePreview('');
      setSubImages([]);
      setVideoUrl('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('업로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Head>
        <title>프로젝트 업로드 - ㅊㅈㅇ</title>
      </Head>
      <Container>
        <Content>
          <Title>프로젝트 업로드</Title>
          <Form onSubmit={handleSubmit}>
            <FormSection>
              <SectionTitle>프로젝트 정보</SectionTitle>
              <Input 
                type="text" 
                name="title"
                placeholder="프로젝트 제목 (한글)" 
                required 
              />
              <Input 
                type="text" 
                name="titleEng"
                placeholder="프로젝트 제목 (영문)" 
                required 
              />
              <Select name="category" required>
                <option value="">카테고리 선택</option>
                <option value="Graphic">Graphic</option>
                <option value="Identity">Identity</option>
                <option value="Motion/Video">Motion/Video</option>
                <option value="Editorial">Editorial</option>
                <option value="Website">Website</option>
              </Select>
              <Input 
                type="number" 
                name="year"
                placeholder="연도" 
                required 
              />
              <Input 
                type="text" 
                name="client"
                placeholder="클라이언트" 
              />
            </FormSection>

            <FormSection>
              <SectionTitle>프로젝트 설명</SectionTitle>
              <TextArea 
                name="description"
                placeholder="프로젝트 설명 (한글)" 
              />
              <TextArea 
                name="descriptionEng"
                placeholder="프로젝트 설명 (영문)" 
              />
            </FormSection>

            <FormSection>
              <SectionTitle>대표 이미지</SectionTitle>
              <Input 
                type="file" 
                name="mainImage"
                accept="image/*"
                onChange={handleMainImageChange}
                required
              />
              {mainImagePreview && (
                <ImagePreviewContainer>
                  <Image
                    src={mainImagePreview}
                    alt="대표 이미지 미리보기"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </ImagePreviewContainer>
              )}
            </FormSection>

            <FormSection>
              <SectionTitle>추가 이미지</SectionTitle>
              <Input
                type="file"
                name="subImages"
                accept="image/*"
                multiple
                onChange={handleSubImagesChange}
              />
              <SubImagesContainer>
                {subImages.map((image, index) => (
                  <SubImageItem key={index}>
                    <ImagePreviewContainer>
                      <Image
                        src={image.preview}
                        alt={`추가 이미지 ${index + 1}`}
                        fill
                        style={{ objectFit: 'contain' }}
                      />
                    </ImagePreviewContainer>
                    <DeleteButton onClick={() => handleDeleteSubImage(index)}>×</DeleteButton>
                    <Input 
                      type="text" 
                      name={`subImageCaption${index}`}
                      placeholder="이미지 설명 (한글)"
                      value={image.caption || ''}
                      onChange={(e) => {
                        const newSubImages = [...subImages];
                        newSubImages[index] = { ...image, caption: e.target.value };
                        setSubImages(newSubImages);
                      }}
                    />
                    <Input 
                      type="text" 
                      name={`subImageCaptionEng${index}`}
                      placeholder="이미지 설명 (영문)"
                      value={image.captionEng || ''}
                      onChange={(e) => {
                        const newSubImages = [...subImages];
                        newSubImages[index] = { ...image, captionEng: e.target.value };
                        setSubImages(newSubImages);
                      }}
                    />
                  </SubImageItem>
                ))}
              </SubImagesContainer>
            </FormSection>

            <FormSection>
              <SectionTitle>영상</SectionTitle>
              <Input 
                type="text" 
                name="videoUrl"
                placeholder="영상 URL (YouTube, Vimeo 등)"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </FormSection>

            <SubmitButton type="submit">업로드</SubmitButton>
          </Form>
        </Content>
      </Container>
    </>
  );
} 