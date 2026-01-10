export type Exam = {
  exam_title: string;
  start_date: string;
  end_date: string;
  duration: string;
  exam_description: string;
};

// Type definition for the exam schedule array
export type ExamSchedule = Exam[];

export type SyllabusDownload = {
  title: string;
  description: string;
  size: string;
};

export type SyllabusDownloads = SyllabusDownload[];
