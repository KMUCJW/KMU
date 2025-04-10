export interface Project {
  id: number;
  title: string;
  titleEng?: string;
  image: string;
  category: 'Graphic' | 'Editorial' | 'Identity' | 'Motion' | 'Practice' | 'Website';
  year: number;
  client?: string;
}

export type Language = 'kor' | 'eng'; 