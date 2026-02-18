export interface MultiLangText {
  en: string;
  da: string;
  pa: string;
}

export interface Exam {
  exam_title: MultiLangText;
  start_date: string;
  end_date: string;
  exam_description: MultiLangText;
}

export interface Resourceies {
  title: MultiLangText;
  description: MultiLangText;
  file: string;
}
