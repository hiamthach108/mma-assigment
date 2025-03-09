export type ArtTool = {
  id: string;
  artName: string;
  description: string;
  price: number;
  glassSurface: boolean;
  image: string;
  brand: string;
  limitedTimeDeal: boolean;
  feedbacks: ArtToolFeedback[];
};

export type ArtToolFeedback = {
  rating: number;
  comment: string;
  author: string;
  date: string;
};
