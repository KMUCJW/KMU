import { useState } from 'react';
import styled from 'styled-components';

const UploadContainer = styled.div`
  margin: 20px 0;
`;

const UploadButton = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 4px;
  background-color: #eee;
  margin-top: 10px;
  border-radius: 2px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background-color: #000;
    transition: width 0.2s;
  }
`;

export default function ImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setProgress(0);

      const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      console.log('Upload successful:', data.url);
      
      // TODO: Handle successful upload (e.g., update project data)
      setProgress(100);
      
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadContainer>
      <UploadButton>
        {uploading ? '업로드 중...' : '이미지 업로드'}
        <HiddenInput
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
        />
      </UploadButton>
      {uploading && <ProgressBar progress={progress} />}
    </UploadContainer>
  );
} 