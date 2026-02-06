// src/data/alumniData.ts

import type { Alumni } from "../entities/Alumini";

export const alumniData: Alumni[] = [
  {
    id: "alumni-1",
    name: "Dr. Ahmad Fahim Azizi",
    gradeLevel: "A+",
    graduatedYear: 2015,
    image: "/images/bg-1.jpg",
    email: "a.azizi@example.com",
    quote: {
      en: "Sultan Zoy High School gave me the foundation to dream big and achieve bigger.",
      da: "مکتب سلطان زوی به من پایه‌ای داد تا رویاهای بزرگ داشته باشم و بزرگتر به آن دست یابم.",
      pa: "د سلطان زوی لیسه ماته بنسټ راکړ چې لوی خوبونه وګورم او لویې لاسته راوړنې ترلاسه کړم.",
    },
    achievements: [
      {
        en: "Graduated with honors from Kabul Medical University",
        da: "با افتخار از پوهنتون طبی کابل فارغ شد",
        pa: "د کابل طبی پوهنتون څخه د افتخار سره فارغ شو",
      },
      {
        en: "Published 15+ research papers on cardiovascular health in Central Asia",
        da: "بیش از ۱۵ مقاله تحقیقی در مورد سلامت قلب و عروق در آسیای مرکزی منتشر کرد",
        pa: "په منځنۍ اسیا کې د زړه روغتیا په اړه له ۱۵ څخه ډیر څیړنیز مقالې خپرې کړې",
      },
      {
        en: "Currently working as Cardiologist at Kabul Medical University Hospital",
        da: "در حال حاضر به عنوان داکتر قلب در شفاخانه پوهنتون طبی کابل کار می‌کند",
        pa: "اوس مهال د کابل طبی پوهنتون روغتون کې د زړه ډاکټر په توګه کار کوي",
      },
    ],
  },
  {
    id: "alumni-2",
    name: "Mariam Nasiri",
    gradeLevel: "A+",
    graduatedYear: 2017,
    image: "/images/bg-2.jpg",
    email: "mariam.nasiri@example.com",
    quote: {
      en: "The values of perseverance and excellence I learned here shaped my career.",
      da: "ارزش‌های استقامت و تعالی که اینجا آموختم، حرفه من را شکل داد.",
      pa: "د استقامت او غوره والي ارزښتونه چې ما دلته زده کړل زما کیریر جوړ کړ.",
    },
    achievements: [
      {
        en: "Top of class in Computer Science",
        da: "برتر کلاس در علوم کامپیوتر",
        pa: "په کمپیوټر ساینس کې د ټولګي غوره",
      },
      {
        en: "Software Engineer at Google - Mountain View, CA",
        da: "مهندس نرم‌افزار در گوگل - مانتین ویو، کالیفورنیا",
        pa: "د ګوګل کې سافټویر انجینر - ماونټین ویو، کالیفورنیا",
      },
      {
        en: "Led development of accessibility features used by millions globally",
        da: "توسعه ویژگی‌های دسترسی که توسط میلیون‌ها نفر در سراسر جهان استفاده می‌شود را رهبری کرد",
        pa: "د لاسرسي ځانګړتیاوو پراختیا یې رهبري کړې چې په نړیواله کچه د میلیونونو لخوا کارول کیږي",
      },
    ],
  },
  {
    id: "alumni-3",
    name: "Hamid Karimi",
    gradeLevel: "A",
    graduatedYear: 2016,
    image: "/images/bg-3.jpg",
    email: "h.karimi@unep.org",
    quote: {
      en: "This school taught me to think globally while serving locally.",
      da: "این مکتب به من آموخت که جهانی فکر کنم در حالی که محلی خدمت می‌کنم.",
      pa: "دې ښوونځي ماته وښوده چې نړیوال فکر وکړم پداسې حال کې چې محلي خدمت وکړم.",
    },
    achievements: [
      {
        en: "Environmental Science degree with distinction",
        da: "درجه علوم محیط زیست با تمایز",
        pa: "د چاپیریال ساینس درجه د ځانګړتیا سره",
      },
      {
        en: "Environmental Scientist at UN Environment Programme",
        da: "دانشمند محیط زیست در برنامه محیط زیست سازمان ملل",
        pa: "د ملګرو ملتونو د چاپیریال برنامې کې د چاپیریال پوهاند",
      },
      {
        en: "Pioneered sustainable agriculture projects across Afghanistan",
        da: "پیشگام پروژه‌های کشاورزی پایدار در سراسر افغانستان",
        pa: "په افغانستان کې د پایدارې کرنې پروژې پیل کړې",
      },
    ],
  },
  {
    id: "alumni-4",
    name: "Fatima Rezaie",
    gradeLevel: "A+",
    graduatedYear: 2018,
    image: "/images/bg-4.jpg",
    email: "f.rezaie@icj.org",
    quote: {
      en: "Justice begins with education, and my education began here.",
      da: "عدالت با آموزش آغاز می‌شود و آموزش من از اینجا شروع شد.",
      pa: "عدالت له زده کړې سره پیل کیږي، او زما زده کړه دلته پیل شوه.",
    },
    achievements: [
      {
        en: "Graduated top of class in Law and Humanities",
        da: "با رتبه اول در حقوق و علوم انسانی فارغ شد",
        pa: "د حقوقو او بشري علومو کې د ټولګي په لومړي درجه فارغ شوه",
      },
      {
        en: "Civil Rights Lawyer at International Court of Justice",
        da: "وکیل حقوق مدنی در دادگاه بین‌المللی دادگستری",
        pa: "د عدالت نړیواله محکمه کې د مدني حقونو وکیل",
      },
      {
        en: "Represented vulnerable communities in landmark human rights cases",
        da: "نمایندگی از جوامع آسیب‌پذیر در پرونده‌های تاریخی حقوق بشر",
        pa: "په تاریخي بشري حقونو قضیو کې د زیان منونکو ټولنو استازیتوب وکړ",
      },
    ],
  },
  {
    id: "alumni-5",
    name: "Rashid Ahmadi",
    gradeLevel: "A",
    graduatedYear: 2014,
    image: "/images/bg-5.jpg",
    email: "rashid@afghantech.af",
    quote: {
      en: "Innovation starts with strong foundations - Sultan Zoy gave me mine.",
      da: "نوآوری با پایه‌های قوی شروع می‌شود - سلطان زوی پایه من را داد.",
      pa: "نوښت له قوي بنسټونو سره پیل کیږي - سلطان زوی ما ته زما بنسټ راکړ.",
    },
    achievements: [
      {
        en: "Business and Economics honors graduate",
        da: "فارغ‌التحصیل با افتخار در تجارت و اقتصاد",
        pa: "د سوداګرۍ او اقتصاد د افتخار فارغ",
      },
      {
        en: "Founded Afghan Tech Solutions - Afghanistan's first tech incubator",
        da: "بنیانگذار راه‌حل‌های تکنالوژی افغانستان - اولین نوآوری‌گاه فناوری افغانستان",
        pa: "د افغانستان ټیکنالوژي حلونه تاسیس کړل - د افغانستان لومړی ټیکنالوژي انکیوبیټر",
      },
      {
        en: "Created 500+ jobs and mentored 200+ young entrepreneurs",
        da: "بیش از ۵۰۰ شغل ایجاد کرد و بیش از ۲۰۰ کارآفرین جوان را راهنمایی کرد",
        pa: "له ۵۰۰ څخه ډیرې دندې رامنځته کړې او له ۲۰۰ څخه ډیرو ځوانو سوداګرو ته یې لارښوونه کړې",
      },
    ],
  },
  {
    id: "alumni-6",
    name: "Zahra Mohammadi",
    gradeLevel: "A+",
    graduatedYear: 2019,
    image: "/images/bg-7.jpg",
    email: "z.mohammadi@nasa.gov",
    quote: {
      en: "From the classrooms of Kabul to the stars - dreams have no limits.",
      da: "از کلاس‌های درسی کابل تا ستاره‌ها - رویاها محدودیتی ندارند.",
      pa: "د کابل له ټولګیو څخه ستورو ته - خوبونه هیڅ حد نه لري.",
    },
    achievements: [
      {
        en: "Perfect score in Physics and Mathematics",
        da: "نمره کامل در فیزیک و ریاضیات",
        pa: "په فزیک او ریاضیاتو کې بشپړه نمره",
      },
      {
        en: "Aerospace Engineer at NASA - Jet Propulsion Laboratory",
        da: "مهندس هوافضا در ناسا - آزمایشگاه پیشرانش جت",
        pa: "ناسا کې د هوايي فضا انجینر - د جیټ پروپلشن لابراتوار",
      },
      {
        en: "Contributed to Mars Rover mission design and implementation",
        da: "در طراحی و اجرای ماموریت مریخ‌نورد مشارکت کرد",
        pa: "د مریخ روور ماموریت ډیزاین او پلي کولو کې ونډه واخیسته",
      },
    ],
  },
  {
    id: "alumni-7",
    name: "Omar Safi",
    gradeLevel: "B+",
    graduatedYear: 2015,
    image: "/images/bg-1.jpg",
    email: "omar.safi@cricket.af",
    quote: {
      en: "Discipline and teamwork learned here became my winning strategy.",
      da: "نظم و کار تیمی که اینجا یاد گرفتم، استراتژی پیروزی من شد.",
      pa: "دلته زده شوي نظم او ټیم کار زما د بریا ستراتیژي شوه.",
    },
    achievements: [
      {
        en: "Captain of school cricket team for 2 consecutive years",
        da: "کاپیتان تیم کریکت مکتب برای ۲ سال متوالی",
        pa: "د دوو پرله پسې کلونو لپاره د ښوونځي کریکټ ټیم کپتان",
      },
      {
        en: "Professional Athlete - Afghanistan National Cricket Team",
        da: "ورزشکار حرفه‌ای - تیم ملی کریکت افغانستان",
        pa: "مسلکي لوبغاړی - د افغانستان ملي کریکټ ټیم",
      },
      {
        en: "Represented Afghanistan in 3 World Cups, scored 2000+ international runs",
        da: "نمایندگی از افغانستان در ۳ جام جهانی، بیش از ۲۰۰۰ امتیاز بین‌المللی کسب کرد",
        pa: "په ۳ نړیوالو جامونو کې د افغانستان استازیتوب وکړ، له ۲۰۰۰ څخه ډیر نړیوال منډې یې ترلاسه کړې",
      },
    ],
  },
  {
    id: "alumni-8",
    name: "Samira Hakimi",
    gradeLevel: "A+",
    graduatedYear: 2017,
    image: "/images/product-2.jpg",
    email: "s.hakimi@bbc.com",
    quote: {
      en: "Truth-telling is a responsibility I learned in these halls.",
      da: "حقیقت‌گویی مسئولیتی است که در این تالارها یاد گرفتم.",
      pa: "د ریښتیا ویل یوه مسؤلیت دی چې ما په دې تالارونو کې زده کړی.",
    },
    achievements: [
      {
        en: "Editor-in-Chief of school newspaper and debate team leader",
        da: "سردبیر روزنامه مکتب و رهبر تیم مناظره",
        pa: "د ښوونځي ورځپاڼې مدیر او د مناظرې ټیم مشر",
      },
      {
        en: "International Journalist at BBC World Service",
        da: "روزنامه‌نگار بین‌المللی در سرویس جهانی بی‌بی‌سی",
        pa: "د بي بي سي نړیواله خدمت کې نړیواله ژورنالیسټه",
      },
      {
        en: "Won Pulitzer Prize for investigative reporting on regional conflicts",
        da: "برنده جایزه پولیتزر برای گزارش‌های تحقیقی درباره درگیری‌های منطقه‌ای",
        pa: "د سیمه ییزو شخړو په اړه د څیړنیز راپور ورکولو لپاره د پولیتزر جایزه وګټله",
      },
    ],
  },
  {
    id: "alumni-9",
    name: "Naveed Stanekzai",
    gradeLevel: "A",
    graduatedYear: 2016,
    image: "/images/bg-1.jpg",
    email: "n.stanekzai@fosterpartners.com",
    quote: {
      en: "Building a better world starts with a solid education.",
      da: "ساختن جهان بهتر با یک آموزش محکم شروع می‌شود.",
      pa: "د یوې ښې نړۍ جوړول له قوي زده کړې سره پیل کیږي.",
    },
    achievements: [
      {
        en: "Won national architecture competition for school design project",
        da: "برنده مسابقه ملی معماری برای پروژه طراحی مکتب",
        pa: "د ښوونځي ډیزاین پروژې لپاره د ملي معمارۍ سیالۍ وګټله",
      },
      {
        en: "Architect & Urban Planner at Foster + Partners - London",
        da: "معمار و برنامه‌ریز شهری در فاستر + پارتنرز - لندن",
        pa: "فوسټر + پارټنرز کې معمار او ښاري پلان جوړونکی - لندن",
      },
      {
        en: "Designed sustainable housing for 10,000+ families in developing nations",
        da: "مسکن پایدار برای بیش از ۱۰,۰۰۰ خانواده در کشورهای در حال توسعه طراحی کرد",
        pa: "په مخ پر ودې هیوادونو کې له ۱۰،۰۰۰ څخه ډیرو کورنیو لپاره پایدار کورونه ډیزاین کړل",
      },
    ],
  },
];

// Helper function to get unique graduation years
export const getGraduationYears = (): number[] => {
  const years = alumniData.map((alumni) => alumni.graduatedYear);
  return Array.from(new Set(years)).sort((a, b) => b - a);
};
