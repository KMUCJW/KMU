export type Category = 'All types' | 'Graphic' | 'Identity' | 'Motion/Video';

export interface Project {
  id: string;
  title: string;
  titleEng: string;
  category: Category;
  image: string;
  year: string;
  description?: string;
  descriptionEng?: string;
  imageUrl?: string;
}

export type Language = 'ko' | 'en'; 