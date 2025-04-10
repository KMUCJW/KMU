export type Language = 'kor' | 'eng';

export interface Project {
  id: number;
  title: string;
  titleEng: string;
  image: string;
  category: 'All types' | 'Graphic' | 'Identity' | 'Motion/Video' | 'Editorial' | 'Website';
  year: number;
  client?: string;
  description?: string;
  descriptionEng?: string;
  subImages?: {
    url: string;
    caption?: string;
    captionEng?: string;
  }[];
  credits?: {
    role: string;
    name: string;
  }[];
  tags?: string[];
  video?: {
    url: string;
    type: 'youtube' | 'vimeo';
  };
} 