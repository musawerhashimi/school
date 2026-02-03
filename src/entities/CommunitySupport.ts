export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface SupportProgram {
  icon: "users" | "heart" | "handshake" | "globe";
  title: MultiLangText;
  description: MultiLangText;
  impact: MultiLangText;
}

export interface CommunityPartner {
  logo: string;
  name: MultiLangText;
  description: MultiLangText;
  collaboration: MultiLangText;
  website?: string;
}
