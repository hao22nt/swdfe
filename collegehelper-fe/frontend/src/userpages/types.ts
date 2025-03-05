export interface AdmissionInfo {
  id: number;
  universityName: string;
  majorName: string;
  baseScore: number;
  quota: number;
  admissionDate: string;
  isBookmarked: boolean;
}

export interface WishlistItem {
  id: number;
  universityName: string;
  majorName: string;
  addedDate: string;
}

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  publishDate: string;
  url: string;
}
