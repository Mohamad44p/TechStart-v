export interface Partner {
  id: string;
  type: "PROJECT_OF" | "FUNDED_BY" | "IMPLEMENTED_BY";
  imageUrl: string;
  name_en: string;
  name_ar: string;
  order: number;
}

export interface Footer {
  id: string;
  techStartTitle_en: string;
  techStartTitle_ar: string;
  titleColor: string;
  gradientColor: string;
  instagram: string | null;
  linkedin: string | null;
  facebook: string | null;
  youtube: string | null;
  twitter: string | null;
  partners: Partner[];
}
