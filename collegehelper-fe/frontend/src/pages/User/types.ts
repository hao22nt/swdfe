
export interface AdmissionInfo {
  id: string;
  universityName: string;
  majorName: string;
  baseScore?: number;
  quota?: string | number;
  admissionDate: string;
  deadline?: string;
  isBookmarked: boolean;
}

export interface InforMethod {
  inforMethodId: string;
  methodName: string;
  scoreType: string;
  scoreRequirement: number;
  percentageOfQuota: number;
}

export interface AdmissionDetail {
  id: string;
  quota: number;
  admissionDate: string;
  deadline: string;
  inforMethods: InforMethod[];
}


export interface WishlistItem {
  id: string;
  universityName: string; // Không còn optional
  majorName: string;
  admissionDate?: string;
  deadline?: string;
  quota?: string | number;
}

export interface AcademicYear {
  id: string;
  year: number;
}

export interface AdmissionMethod {
  id: string;
  methodName: string;
  requiredDocuments?: string | null;
  description?: string | null;
}


