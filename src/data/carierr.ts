import type { DepartmentJob, JobPosting } from "../entities/carierr";

// Mock Data - Departments
export const departments: DepartmentJob[] = [
  {
    id: 1,
    name: {
      en: "Mathematics",
      da: "ریاضیات",
      pa: "ریاضی",
    },
  },
  {
    id: 2,
    name: {
      en: "Science",
      da: "علوم",
      pa: "ساینس",
    },
  },
  {
    id: 3,
    name: {
      en: "Languages",
      da: "زبان‌ها",
      pa: "ژبې",
    },
  },
  {
    id: 4,
    name: {
      en: "Administration",
      da: "اداره",
      pa: "اداره",
    },
  },
  {
    id: 5,
    name: {
      en: "Physical Education",
      da: "تربیت بدنی",
      pa: "فزیکی تعلیم",
    },
  },
];

// Mock Data - Job Postings
export const jobPostings: JobPosting[] = [
  {
    id: "1",
    title: {
      en: "Mathematics Teacher",
      da: "معلم ریاضی",
      pa: "د ریاضی ښوونکی",
    },
    department_id: 1,
    type: "Full-time",
    location: "Sultan Zoy High School, Main Campus",
    salary: "$45,000 - $65,000/year",
    postedDate: "2026-1-31",
    deadline: "2026-03-28",
    description: {
      en: "We are seeking a passionate and dedicated Mathematics Teacher to join our academic team. The ideal candidate will inspire students to excel in mathematics and develop critical thinking skills through innovative teaching methods and personalized attention.",
      da: "ما به دنبال یک معلم ریاضی متعهد و پرشور هستیم که به تیم آکادمیک ما بپیوندد. کاندید ایده‌آل دانش‌آموزان را برای برتری در ریاضیات و توسعه مهارت‌های تفکر انتقادی از طریق روش‌های آموزشی نوآورانه الهام می‌بخشد.",
      pa: "موږ د یو جذبې او وقف شوي ریاضی ښوونکي په لټه کې یو چې زموږ د علمی ټیم سره یوځای شي. مناسب کاندید به زده کوونکي ته د ریاضی کې د عالي او د نوښتګرو تدریسی میتودونو له لارې د انتقادی فکر مهارتونو پراختیا کې الهام ورکړي.",
    },
    requirements: {
      en: "Bachelor's degree in Mathematics or Education, Teaching certification/license, Minimum 2 years of teaching experience, Strong communication and classroom management skills",
      da: "مدرک لیسانس در ریاضیات یا آموزش و پرورش، گواهینامه/مجوز تدریس، حداقل 2 سال تجربه تدریس، مهارت‌های قوی ارتباطی و مدیریت کلاس",
      pa: "د ریاضی یا تعلیم کې لیسانس، د تدریس سند/جواز، لږ تر لږه 2 کاله د تدریس تجربه، قوي اړیکې او د ټولګی مدیریت مهارتونه",
    },
    gender: "Male",
    number_of_job: 3,
  },
  {
    id: "2",
    title: {
      en: "Physics Teacher",
      da: "معلم فیزیک",
      pa: "د فزیک ښوونکی",
    },
    department_id: 2,
    type: "Full-time",
    location: "Sultan Zoy High School, Main Campus",
    salary: "$42,000 - $62,000/year",
    postedDate: "2024-12-05",
    deadline: "2025-03-15",
    description: {
      en: "Join our Science Department as a Physics Teacher to guide students through the fascinating world of physics. You will conduct laboratory experiments, develop engaging lesson plans, and help students understand complex physical concepts.",
      da: "به بخش علوم ما به عنوان معلم فیزیک بپیوندید تا دانش‌آموزان را در دنیای جذاب فیزیک راهنمایی کنید. شما آزمایش‌های آزمایشگاهی انجام می‌دهید، برنامه‌های درسی جذاب تهیه می‌کنید و به دانش‌آموزان کمک می‌کنید تا مفاهیم پیچیده فیزیکی را درک کنند.",
      pa: "زموږ د ساینس څانګې سره د فزیک ښوونکي په توګه یوځای شئ ترڅو زده کوونکي د فزیک په زړه راښکونکي نړۍ کې رهنمایي کړئ. تاسو به لابراتواري تجربې ترسره کړئ، د زړه راښکونکو درسي پلانونو جوړولو کې برخه واخلئ او زده کوونکو سره د پیچلو فزیکی مفهومونو په پوهیدو کې مرسته وکړئ.",
    },
    requirements: {
      en: "Bachelor's degree in Physics or related field, Teaching certification, Experience with laboratory equipment and safety protocols, Ability to make complex concepts accessible to students",
      da: "مدرک لیسانس در فیزیک یا رشته مرتبط، گواهینامه تدریس، تجربه با تجهیزات آزمایشگاهی و پروتکل‌های ایمنی، توانایی در دسترس قرار دادن مفاهیم پیچیده برای دانش‌آموزان",
      pa: "د فزیک یا اړوند ساحه کې لیسانس، د تدریس سند، د لابراتوار تجهیزاتو او خوندیتوب پروتوکولونو سره تجربه، زده کوونکو ته د پیچلو مفهومونو د لاسرسي وړ کولو وړتیا",
    },
    gender: "Female",
    number_of_job: 2,
  },
  {
    id: "3",
    title: {
      en: "English Language Teacher",
      da: "معلم زبان انگلیسی",
      pa: "د انګلیسی ژبې ښوونکی",
    },
    department_id: 3,
    type: "Full-time",
    location: "Sultan Zoy High School, Main Campus",
    salary: "$40,000 - $58,000/year",
    postedDate: "2024-12-10",
    deadline: "2025-03-01",
    description: {
      en: "We are looking for an enthusiastic English Language Teacher to help students develop strong communication skills in English. You will teach reading, writing, speaking, and listening skills while fostering a love for literature and language.",
      da: "ما به دنبال یک معلم زبان انگلیسی پرشور هستیم تا به دانش‌آموزان کمک کند مهارت‌های ارتباطی قوی در زبان انگلیسی را توسعه دهند. شما مهارت‌های خواندن، نوشتن، صحبت کردن و گوش دادن را تدریس می‌کنید در حالی که علاقه به ادبیات و زبان را پرورش می‌دهید.",
      pa: "موږ د یو جوش لرونکي انګلیسی ژبې ښوونکي په لټه کې یو چې زده کوونکو سره په انګلیسي کې د قوي اړیکو مهارتونو پراختیا کې مرسته وکړي. تاسو به د لوستلو، لیکلو، خبرو اترو او اوریدلو مهارتونه زده کړئ پداسې حال کې چې د ادبیاتو او ژبې سره مینه پیاوړې کړئ.",
    },
    requirements: {
      en: "Bachelor's degree in English, Literature, or Education, Native or near-native English proficiency, Teaching certification, Experience with diverse learning styles and ESL students",
      da: "مدرک لیسانس در زبان انگلیسی، ادبیات یا آموزش و پرورش، مهارت زبان انگلیسی در سطح بومی یا نزدیک به بومی، گواهینامه تدریس، تجربه با سبک‌های یادگیری متنوع و دانش‌آموزان ESL",
      pa: "په انګلیسي، ادبیاتو یا تعلیم کې لیسانس، مورنۍ یا مورنۍ ته نږدې انګلیسي مهارت، د تدریس سند، د مختلفو زده کړې سټایلونو او ESL زده کوونکو سره تجربه",
    },
    gender: "Female",
    number_of_job: 4,
  },
  {
    id: "4",
    title: {
      en: "Administrative Assistant",
      da: "دستیار اداری",
      pa: "اداری مرستیال",
    },
    department_id: 4,
    type: "Full-time",
    location: "Sultan Zoy High School, Main Campus",
    salary: "$32,000 - $45,000/year",
    postedDate: "2024-12-15",
    deadline: "2025-02-15",
    description: {
      en: "We need an organized and detail-oriented Administrative Assistant to support our school operations. You will handle correspondence, maintain records, coordinate schedules, and provide essential administrative support to staff and management.",
      da: "ما به یک دستیار اداری سازمان‌یافته و دقیق نیاز داریم تا از عملیات مدرسه ما پشتیبانی کند. شما مکاتبات را انجام می‌دهید، سوابق را نگهداری می‌کنید، برنامه‌ها را هماهنگ می‌کنید و پشتیبانی اداری ضروری را به کارکنان و مدیریت ارائه می‌دهید.",
      pa: "موږ د یو سازمان شوي او تفصیل متوجه اداری مرستیال ته اړتیا لرو چې زموږ د ښوونځي عملیاتو ملاتړ وکړي. تاسو به خط و کتابت اداره کړئ، ریکارډونه وساتئ، مهالویشونه همغږي کړئ او کارمندانو او مدیریت ته اړین اداری ملاتړ چمتو کړئ.",
    },
    requirements: {
      en: "High school diploma or equivalent, Proficiency in Microsoft Office Suite, Excellent organizational and communication skills, Minimum 1 year of administrative experience, Ability to multitask and work under pressure",
      da: "دیپلم دبیرستان یا معادل آن، مهارت در Microsoft Office Suite، مهارت‌های سازمانی و ارتباطی عالی، حداقل 1 سال تجربه اداری، توانایی انجام چند کار همزمان و کار تحت فشار",
      pa: "د لیسې ډیپلوم یا معادل، په Microsoft Office Suite کې مهارت، غوره سازماني او اړیکي مهارتونه، لږ تر لږه 1 کال اداري تجربه، د څو کارونو ترسره کولو او د فشار لاندې کار کولو وړتیا",
    },
    gender: "Male",
    number_of_job: 1,
  },
  {
    id: "5",
    title: {
      en: "Physical Education Coach",
      da: "مربی تربیت بدنی",
      pa: "د فزیکی تعلیم روزونکی",
    },
    department_id: 5,
    type: "Part-time",
    location: "Sultan Zoy High School, Sports Complex",
    salary: "$28,000 - $42,000/year",
    postedDate: "2024-12-20",
    deadline: "2025-03-10",
    description: {
      en: "Join our Physical Education Department to promote health, fitness, and sportsmanship among students. You will design and implement sports programs, coach teams, and instill values of teamwork, discipline, and healthy living.",
      da: "به بخش تربیت بدنی ما بپیوندید تا سلامتی، تناسب اندام و روحیه ورزشی را در بین دانش‌آموزان ترویج دهید. شما برنامه‌های ورزشی را طراحی و اجرا می‌کنید، تیم‌ها را مربیگری می‌کنید و ارزش‌های کار تیمی، نظم و زندگی سالم را القا می‌کنید.",
      pa: "زموږ د فزیکی تعلیم څانګې سره یوځای شئ ترڅو د زده کوونکو تر منځ روغتیا، فټنس او سپورټ مینه وده وکړي. تاسو به سپورټ پروګرامونه ډیزاین او پلي کړئ، ټیمونه روزنه ورکړئ او د ټیم کار، نظم او روغ ژوند ارزښتونه پیاوړي کړئ.",
    },
    requirements: {
      en: "Bachelor's degree in Physical Education or Sports Science, Coaching certification preferred, First Aid and CPR certified, Strong knowledge of various sports and fitness activities, Excellent motivational and leadership skills",
      da: "مدرک لیسانس در تربیت بدنی یا علوم ورزشی، گواهینامه مربیگری ترجیحاً، گواهی کمک‌های اولیه و CPR، دانش قوی از ورزش‌ها و فعالیت‌های تناسب اندام مختلف، مهارت‌های انگیزشی و رهبری عالی",
      pa: "په فزیکی تعلیم یا سپورټ ساینس کې لیسانس، د روزنې سند غوره دی، د لومړنیو مرستو او CPR تصدیق شوی، د مختلفو سپورټونو او فټنس فعالیتونو قوي پوهه، غوره هڅونکي او مشرتابه مهارتونه",
    },
    gender: "Male",
    number_of_job: 2,
  },
];
