import type {
  CommunityPartner,
  SupportProgram,
} from "../entities/CommunitySupport";

export const supportPrograms: SupportProgram[] = [
  {
    icon: "heart",
    title: {
      en: "Scholarship Fund",
      da: "صندوق بورسیه تحصیلی",
      pa: "د بورس صندوق",
    },
    description: {
      en: "Providing financial assistance to talented students from underprivileged backgrounds, ensuring equal access to quality education for all deserving students.",
      da: "ارائه کمک‌های مالی به دانش‌آموزان با استعداد از خانواده‌های کم‌درآمد و تضمین دسترسی برابر به آموزش با کیفیت برای همه دانش‌آموزان شایسته.",
      pa: "د لږ امکاناتو څخه د استعدادو زده کوونکو ته مالي مرستې چمتو کول، د ټولو مستحقو زده کوونکو لپاره د کیفیت لرونکي زده کړې سره مساوي لاسرسي تضمینول.",
    },
    impact: {
      en: "150+ students supported annually",
      da: "سالانه ۱۵۰+ دانش‌آموز حمایت شده",
      pa: "په کال کې 150+ زده کوونکي ملاتړ شوي",
    },
  },
  {
    icon: "users",
    title: {
      en: "Community Tutoring",
      da: "آموزش اجتماعی",
      pa: "ټولنیز روزنه",
    },
    description: {
      en: "Free after-school tutoring programs conducted by our teachers and senior students, helping struggling learners catch up and excel in their studies.",
      da: "برنامه‌های آموزش رایگان بعد از مکتب که توسط معلمان و شاگردان بزرگسال ما انجام می‌شود و به دانش‌آموزان در مشکل کمک می‌کند تا در درس‌هایشان جبران و موفق شوند.",
      pa: "د ښوونځي وروسته وړیا روزنیز پروګرامونه چې زموږ د ښوونکو او لوړو زده کوونکو لخوا ترسره کیږي، د ستونزمنو زده کوونکو سره مرسته کوي چې په خپلو درسونو کې بریالي شي.",
    },
    impact: {
      en: "200+ students benefiting weekly",
      da: "هفته‌وار بیش از ۲۰۰ دانش‌آموز بهره‌مند می‌شوند",
      pa: "په اونۍ کې 200+ زده کوونکي ګټه اخلي",
    },
  },
  {
    icon: "handshake",
    title: {
      en: "Healthcare Partnership",
      da: "همکاری صحی",
      pa: "د روغتیا همکاري",
    },
    description: {
      en: "Collaboration with local health organizations to provide regular health check-ups, vaccinations, and health education to our students and their families.",
      da: "همکاری با سازمان‌های صحی محلی برای ارائه معاینات منظم صحی، واکسیناسیون و آموزش صحی به دانش‌آموزان و خانواده‌های آنها.",
      pa: "د سیمه ایزو روغتیایي سازمانونو سره همکاري ترڅو زموږ زده کوونکو او د هغوی کورنیو ته منظم روغتیایي معاینې، واکسین او د روغتیا زده کړه چمتو کړي.",
    },
    impact: {
      en: "500+ families served annually",
      da: "سالانه بیش از ۵۰۰ خانواده خدمات می‌گیرند",
      pa: "په کال کې 500+ کورنیو ته خدمت شوی",
    },
  },
  {
    icon: "globe",
    title: {
      en: "Environmental Initiative",
      da: "ابتکار محیط زیستی",
      pa: "د چاپیریال نوښت",
    },
    description: {
      en: "Tree plantation drives, recycling programs, and environmental awareness campaigns to build a sustainable future and teach students environmental responsibility.",
      da: "کمپاین‌های کاشت درخت، برنامه‌های بازیافت و کمپاین‌های آگاهی محیط زیستی برای ساختن آینده پایدار و آموزش مسئولیت محیط زیستی به دانش‌آموزان.",
      pa: "د ونو کرلو کمپاینونه، د بیا کارولو پروګرامونه، او د چاپیریال پوهاوي کمپاینونه ترڅو پایدار راتلونکی جوړ کړي او زده کوونکو ته د چاپیریال مسؤلیت زده کړي.",
    },
    impact: {
      en: "2000+ trees planted since 2020",
      da: "بیش از ۲۰۰۰ درخت از سال ۲۰۲۰ کاشته شده",
      pa: "د 2020 راهیسې 2000+ ونې کرل شوي",
    },
  },
  {
    icon: "heart",
    title: {
      en: "Food Security Program",
      da: "برنامه امنیت غذایی",
      pa: "د خوراکي امنیت پروګرام",
    },
    description: {
      en: "Daily nutritious meals provided to students from economically disadvantaged families, ensuring no child goes hungry while pursuing their education.",
      da: "وعده‌های غذایی مغذی روزانه برای دانش‌آموزان از خانواده‌های محروم اقتصادی فراهم می‌شود تا هیچ کودکی در حین تحصیل گرسنه نماند.",
      pa: "د اقتصادي پلوه محرومو کورنیو د زده کوونکو لپاره ورځني مغذي خواړه چمتو کول، ډاډ ترلاسه کول چې هیڅ ماشوم د زده کړې په جریان کې وږی پاتې نشي.",
    },
    impact: {
      en: "100+ meals served daily",
      da: "روزانه بیش از ۱۰۰ وعده غذایی سرو می‌شود",
      pa: "په ورځ کې 100+ خواړه ورکول کیږي",
    },
  },
  {
    icon: "users",
    title: {
      en: "Parent Education Workshops",
      da: "ورکشاپ‌های آموزشی والدین",
      pa: "د مور او پلار د زده کړې ورکشاپونه",
    },
    description: {
      en: "Regular workshops for parents on child development, modern parenting techniques, and educational support strategies to create a supportive home environment.",
      da: "ورکشاپ‌های منظم برای والدین در مورد رشد کودک، تکنیک‌های والدینی مدرن و استراتژی‌های حمایت آموزشی برای ایجاد محیط حمایتی در خانه.",
      pa: "د مور او پلار لپاره منظم ورکشاپونه د ماشومانو پرمختګ، د اوسني مور او پلار تخنیکونو، او د تعلیمي ملاتړ ستراتیژیو په اړه ترڅو په کور کې ملاتړي چاپیریال جوړ کړي.",
    },
    impact: {
      en: "300+ parents trained annually",
      da: "سالانه بیش از ۳۰۰ والدین آموزش می‌بینند",
      pa: "په کال کې 300+ مور او پلار روزل شوي",
    },
  },
];

export const communityPartners: CommunityPartner[] = [
  {
    logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400&h=300&fit=crop",
    name: {
      en: "Afghanistan Red Crescent Society",
      da: "جمعیت هلال احمر افغانستان",
      pa: "د افغانستان سره میاشتې ټولنه",
    },
    description: {
      en: "Leading humanitarian organization providing emergency relief, healthcare services, and community development programs across Afghanistan.",
      da: "سازمان پیشرو بشردوستانه که خدمات امداد اضطراری، خدمات صحی و برنامه‌های توسعه اجتماعی را در سراسر افغانستان ارائه می‌دهد.",
      pa: "مخکښ بشري سازمان چې په ټول افغانستان کې بیړني مرستې، روغتیایي خدمتونه، او د ټولنې پرمختیایي پروګرامونه وړاندې کوي.",
    },
    collaboration: {
      en: "Emergency health services, disaster preparedness training for students and staff",
      da: "خدمات صحی اضطراری، آموزش آمادگی در برابر بلایا برای دانش‌آموزان و کارکنان",
      pa: "بیړني روغتیایي خدمتونه، د زده کوونکو او کارمندانو لپاره د ناورینونو د چمتووالي روزنه",
    },
    website: "https://www.ifrc.org/our-network/national-societies/afghanistan",
  },
  {
    logo: "https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=400&h=300&fit=crop",
    name: {
      en: "UNICEF Afghanistan",
      da: "یونیسف افغانستان",
      pa: "یونیسف افغانستان",
    },
    description: {
      en: "United Nations agency dedicated to protecting children's rights and providing education, healthcare, and protection to children in Afghanistan.",
      da: "آژانس سازمان ملل متحد که به حفاظت از حقوق کودکان و ارائه آموزش، مراقبت‌های صحی و حمایت از کودکان در افغانستان اختصاص دارد.",
      pa: "د ملګرو ملتونو ادارې چې د ماشومانو حقونو ساتنې او په افغانستان کې ماشومانو ته زده کړه، روغتیا پاملرنه، او محافظت چمتو کولو لپاره وقف شوې.",
    },
    collaboration: {
      en: "Educational materials support, teacher training programs, child protection initiatives",
      da: "حمایت از مواد آموزشی، برنامه‌های آموزش معلمان، ابتکارات حمایت از کودکان",
      pa: "د تعلیمي موادو ملاتړ، د ښوونکو د روزنې پروګرامونه، د ماشومانو د ساتنې نوښتونه",
    },
    website: "https://www.unicef.org/afghanistan/",
  },
  {
    logo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
    name: {
      en: "Afghan Education Foundation",
      da: "بنیاد آموزش افغانستان",
      pa: "د افغانستان د زده کړې بنسټ",
    },
    description: {
      en: "Non-profit organization focused on improving educational infrastructure and providing scholarships to Afghan students pursuing higher education.",
      da: "سازمان غیرانتفاعی که بر بهبود زیرساخت‌های آموزشی و ارائه بورسیه به دانش‌آموزان افغان در تعقیب تحصیلات عالی تمرکز دارد.",
      pa: "غیر انتفاعي سازمان چې د تعلیمي زیربناوو په ښه کولو او د لوړو زده کړو په تعقیب کې افغان زده کوونکو ته د بورس په چمتو کولو تمرکز لري.",
    },
    collaboration: {
      en: "Merit-based scholarships, library development, digital learning resources",
      da: "بورسیه‌های مبتنی بر شایستگی، توسعه کتابخانه، منابع یادگیری دیجیتال",
      pa: "د وړتیا پر بنسټ بورسونه، د کتابتون پراختیا، ډیجیټل زده کړې سرچینې",
    },
    website: "https://www.afghaneducation.org/",
  },
  {
    logo: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=300&fit=crop",
    name: {
      en: "Kabul Medical Association",
      da: "انجمن طبی کابل",
      pa: "د کابل طبي ټولنه",
    },
    description: {
      en: "Professional medical organization providing healthcare services, health education, and medical outreach programs to communities across Kabul.",
      da: "سازمان حرفه‌ای طبی که خدمات صحی، آموزش صحت و برنامه‌های دسترسی طبی را به جوامع در سراسر کابل ارائه می‌دهد.",
      pa: "مسلکي طبي سازمان چې په کابل کې ټولنو ته روغتیایي خدمتونه، د روغتیا زده کړه، او طبي پراختیایي پروګرامونه وړاندې کوي.",
    },
    collaboration: {
      en: "Monthly health screenings, first aid training, mental health awareness programs",
      da: "معاینات صحی ماهانه، آموزش کمک‌های اولیه، برنامه‌های آگاهی از صحت روان",
      pa: "میاشتني روغتیایي معاینې، د لومړنیو مرستو روزنه، د رواني روغتیا پوهاوي پروګرامونه",
    },
    website: "https://www.kabulmedical.org/",
  },
  {
    logo: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&h=300&fit=crop",
    name: {
      en: "Tech4Afghanistan",
      da: "تکنالوژی برای افغانستان",
      pa: "ټکنالوژي د افغانستان لپاره",
    },
    description: {
      en: "Technology-focused NGO working to bridge the digital divide by providing computer education and internet access to Afghan youth.",
      da: "سازمان غیردولتی متمرکز بر تکنالوژی که برای پر کردن شکاف دیجیتال از طریق ارائه آموزش کامپیوتر و دسترسی به اینترنت به جوانان افغان کار می‌کند.",
      pa: "د ټکنالوژۍ باندې تمرکز لرونکې غیر دولتي سازمان چې د افغان ځوانانو ته د کمپیوټر زده کړې او انټرنیټ لاسرسي په چمتو کولو سره د ډیجیټل توپیر د پر کولو لپاره کار کوي.",
    },
    collaboration: {
      en: "Computer lab equipment donations, coding workshops, digital literacy training",
      da: "اهدای تجهیزات آزمایشگاه کامپیوتر، کارگاه‌های کدنویسی، آموزش سوادآموزی دیجیتال",
      pa: "د کمپیوټر لابراتوار د تجهیزاتو بسپنې، د کوډنګ ورکشاپونه، د ډیجیټل سواد روزنه",
    },
    website: "https://www.tech4afghanistan.org/",
  },
  {
    logo: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop",
    name: {
      en: "Green Afghanistan Initiative",
      da: "ابتکار افغانستان سبز",
      pa: "د شنه افغانستان نوښت",
    },
    description: {
      en: "Environmental conservation organization dedicated to reforestation, sustainable agriculture, and environmental education across Afghanistan.",
      da: "سازمان حفاظت از محیط زیست اختصاص یافته به جنگل‌کاری مجدد، کشاورزی پایدار و آموزش محیط زیستی در سراسر افغانستان.",
      pa: "د چاپیریال ساتنې سازمان چې په افغانستان کې د ځنګلونو بیا رغونې، پایدار کرنې، او د چاپیریال زده کړې ته وقف شوی.",
    },
    collaboration: {
      en: "School garden projects, environmental clubs, tree planting campaigns",
      da: "پروژه‌های باغ مکتب، باشگاه‌های محیط زیستی، کمپاین‌های کاشت درخت",
      pa: "د ښوونځي باغ پروژې، د چاپیریال کلبونه، د ونو کرلو کمپاینونه",
    },
    website: "https://www.greenafghanistan.org/",
  },
  {
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    name: {
      en: "Sports for Development Afghanistan",
      da: "ورزش برای توسعه افغانستان",
      pa: "د پرمختګ لپاره سپورت افغانستان",
    },
    description: {
      en: "Organization promoting youth development through sports programs, providing equipment and coaching to schools and community centers.",
      da: "سازمانی که توسعه جوانان را از طریق برنامه‌های ورزشی ترویج می‌دهد و تجهیزات و مربیگری را به مکاتب و مراکز اجتماعی ارائه می‌دهد.",
      pa: "سازمان چې د سپورت پروګرامونو له لارې د ځوانانو پراختیا ته وده ورکوي، ښوونځیو او ټولنیزو مرکزونو ته تجهیزات او روزنه چمتو کوي.",
    },
    collaboration: {
      en: "Sports equipment donations, coaching clinics, inter-school tournaments",
      da: "اهدای تجهیزات ورزشی، کلینیک‌های مربیگری، مسابقات بین‌مدرسه‌ای",
      pa: "د سپورت تجهیزاتو بسپنې، د روزنې کلینیکونه، د ښوونځیو ترمنځ سیالۍ",
    },
    website: "https://www.sports4dev-afg.org/",
  },
  {
    logo: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=300&fit=crop",
    name: {
      en: "Women Empowerment Network",
      da: "شبکه توانمندسازی زنان",
      pa: "د ښځو د پیاوړتیا شبکه",
    },
    description: {
      en: "Dedicated to empowering women and girls through education, vocational training, and advocacy for women's rights in Afghan society.",
      da: "اختصاص یافته به توانمندسازی زنان و دختران از طریق آموزش، آموزش حرفه‌ای و حمایت از حقوق زنان در جامعه افغانی.",
      pa: "د زده کړې، مسلکي روزنې، او په افغاني ټولنه کې د ښځو د حقونو د مدافعې له لارې ښځو او انجونو ته د پیاوړتیا وقف شوی.",
    },
    collaboration: {
      en: "Girls' mentorship programs, career counseling, mother-daughter workshops",
      da: "برنامه‌های مربیگری دختران، مشاوره شغلی، کارگاه‌های مادر-دختر",
      pa: "د انجونو د لارښودنې پروګرامونه، د مسلک مشوره، د مور او لور ورکشاپونه",
    },
    website: "https://www.womenempowerment-afg.org/",
  },
  {
    logo: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop",
    name: {
      en: "Cultural Heritage Foundation",
      da: "بنیاد میراث فرهنگی",
      pa: "د کلتوري میراثونو بنسټ",
    },
    description: {
      en: "Preserving and promoting Afghan cultural heritage through educational programs, museum partnerships, and cultural awareness initiatives.",
      da: "حفظ و ترویج میراث فرهنگی افغانی از طریق برنامه‌های آموزشی، همکاری‌های موزیومی و ابتکارات آگاهی فرهنگی.",
      pa: "د تعلیمي پروګرامونو، د موزیم همکاریو، او د کلتوري پوهاوي نوښتونو له لارې د افغاني کلتوري میراثونو ساتنه او وده ورکول.",
    },
    collaboration: {
      en: "Cultural field trips, traditional arts workshops, heritage education programs",
      da: "سفرهای میدانی فرهنگی، کارگاه‌های هنرهای سنتی، برنامه‌های آموزش میراث",
      pa: "کلتوري سفرونه، د دودیزو هنرونو ورکشاپونه، د میراثونو د زده کړې پروګرامونه",
    },
    website: "https://www.culturalheritage-afg.org/",
  },
];
