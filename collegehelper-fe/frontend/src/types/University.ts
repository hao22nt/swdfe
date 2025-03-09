export interface University {
  id: string;
  name: string;
  location: string;
  universityCode: string;
  email: string;
  phoneNumber: string;
  establishedDate: string;
  accreditation: string;
  type: string;
  description: string | null;
  rankingNational: number;
  rankingInternational: number;
  image: string | null;
} 