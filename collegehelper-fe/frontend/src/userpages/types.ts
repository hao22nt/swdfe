export interface AdmissionInfo {
  id: string; // Đổi từ number sang string để khớp với API
  universityName: string;
  majorName: string;
  baseScore?: number; // Tùy chọn, vì API không trả về
  quota?: string; // Đổi từ number sang string, tùy chọn
  admissionDate: string;
  isBookmarked: boolean;
  methodName?: string;
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
