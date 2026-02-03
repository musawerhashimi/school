import type { InternshipCategory, Internship } from "../entities/intership";

// Categories for filtering
export const internshipCategories: InternshipCategory[] = [
  {
    id: "technology",
    name: {
      en: "Technology & IT",
      da: "تکنالوژی و آی‌تی",
      pa: "ټکنالوژي او آی ټي",
    },
  },
  {
    id: "healthcare",
    name: {
      en: "Healthcare",
      da: "مراقبت‌های صحی",
      pa: "روغتیا پاملرنه",
    },
  },
  {
    id: "education",
    name: {
      en: "Education",
      da: "آموزش",
      pa: "زده کړه",
    },
  },
  {
    id: "engineering",
    name: {
      en: "Engineering",
      da: "مهندسی",
      pa: "انجینرۍ",
    },
  },
  {
    id: "business",
    name: {
      en: "Business & Finance",
      da: "تجارت و مالیه",
      pa: "سوداګري او مالیه",
    },
  },
  {
    id: "media",
    name: {
      en: "Media & Communications",
      da: "رسانه و ارتباطات",
      pa: "رسنۍ او اړیکې",
    },
  },
];

// Sample internship opportunities data
export const internshipsData: Internship[] = [
  {
    id: "1",
    title: {
      en: "Web Development Intern",
      da: "کارآموز توسعه وب",
      pa: "د ویب پراختیا کارموزي",
    },
    organization: {
      en: "Tech Solutions Afghanistan",
      da: "راه‌حل‌های تکنالوژی افغانستان",
      pa: "ټیک حلونه افغانستان",
    },
    categoryId: "technology",
    duration: {
      en: "3 months",
      da: "۳ ماه",
      pa: "۳ میاشتې",
    },
    location: {
      en: "Kabul, Afghanistan",
      da: "کابل، افغانستان",
      pa: "کابل، افغانستان",
    },
    description: {
      en: "Join our development team to gain hands-on experience in modern web technologies. You'll work on real projects, learn from experienced developers, and contribute to meaningful solutions.",
      da: "به تیم توسعه ما بپیوندید تا تجربه عملی در تکنالوژی‌های مدرن وب کسب کنید. شما روی پروژه‌های واقعی کار خواهید کرد، از توسعه‌دهندگان با تجربه یاد می‌گیرید و به راه‌حل‌های معنادار کمک می‌کنید.",
      pa: "زموږ د پراختیا ټیم سره یوځای شئ ترڅو د عصري ویب ټکنالوژیو کې عملي تجربه ترلاسه کړئ. تاسو به په ریښتینو پروژو کار وکړئ، له تجربه لرونکو پراختیا کونکو څخه زده کړه وکړئ او معنی لرونکو حلونو کې مرسته وکړئ.",
    },
    requirements: {
      en: "Basic knowledge of HTML, CSS, and JavaScript; Enthusiasm to learn and grow",
      da: "دانش اولیه HTML، CSS و JavaScript; اشتیاق برای یادگیری و رشد",
      pa: "د HTML، CSS او JavaScript اساسي پوهه; د زده کړې او وده کولو لیوالتیا",
    },

    benefits: {
      en: "Mentorship from senior developers, Certificate upon completion",
      da: "راهنمایی از توسعه‌دهندگان ارشد, گواهینامه پس از تکمیل",
      pa: "د بشپړیدو په وخت سند, د لوړ پوړو پراختیا کونکو څخه لارښوونه",
    },

    contactEmail: "careers@techsolutions.af",
    contactPhone: "+93 700 123 456",
    startDate: "2026-03-01",
    applicationDeadline: "2026-02-15",
    isActive: true,
    image: "images/product-3.jpg",
  },
  {
    id: "2",
    title: {
      en: "Healthcare Assistant Trainee",
      da: "کارآموز کمک‌کننده مراقبت‌های صحی",
      pa: "د روغتیا پاملرنې مرستیال روزونکی",
    },
    organization: {
      en: "Kabul Medical Center",
      da: "مرکز طبی کابل",
      pa: "د کابل طبي مرکز",
    },
    categoryId: "healthcare",
    duration: {
      en: "6 months",
      da: "۶ ماه",
      pa: "۶ میاشتې",
    },
    location: {
      en: "Kabul, Afghanistan",
      da: "کابل، افغانستان",
      pa: "کابل، افغانستان",
    },
    description: {
      en: "Experience the healthcare field firsthand by working alongside medical professionals. Learn patient care, medical terminology, and healthcare operations in a supportive environment.",
      da: "با کار کنار متخصصان پزشکی، عرصه مراقبت‌های صحی را از نزدیک تجربه کنید. مراقبت از بیماران، اصطلاحات طبی و عملیات مراقبت‌های صحی را در یک محیط حمایتی یاد بگیرید.",
      pa: "د طبي متخصصینو سره یوځای کار کولو سره د روغتیا پاملرنې ساحه له نږدې تجربه کړئ. په ملاتړي چاپیریال کې د ناروغانو پاملرنه، طبي اصطلاحات او د روغتیا پاملرنې عملیات زده کړئ.",
    },
    requirements: {
      en: "Basic knowledge of HTML, CSS, and JavaScript; Enthusiasm to learn and grow",
      da: "دانش اولیه HTML، CSS و JavaScript; اشتیاق برای یادگیری و رشد",
      pa: "د HTML، CSS او JavaScript اساسي پوهه; د زده کړې او وده کولو لیوالتیا",
    },

    benefits: {
      en: "Mentorship from senior developers, Certificate upon completion",
      da: "راهنمایی از توسعه‌دهندگان ارشد, گواهینامه پس از تکمیل",
      pa: "د بشپړیدو په وخت سند, د لوړ پوړو پراختیا کونکو څخه لارښوونه",
    },
    contactEmail: "hr@kabulmedical.af",
    contactPhone: "+93 700 234 567",
    startDate: "2026-04-01",
    applicationDeadline: "2026-03-15",
    isActive: true,
    image: "images/product.jpg",
  },
  {
    id: "3",
    title: {
      en: "Teaching Assistant",
      da: "دستیار تدریس",
      pa: "د تدریس مرستیال",
    },
    organization: {
      en: "Future Minds Education Center",
      da: "مرکز آموزشی ذهن‌های آینده",
      pa: "د راتلونکي ذهنونو ښوونیز مرکز",
    },
    categoryId: "education",
    duration: {
      en: "4 months",
      da: "۴ ماه",
      pa: "۴ میاشتې",
    },
    location: {
      en: "Herat, Afghanistan",
      da: "هرات، افغانستان",
      pa: "هرات، افغانستان",
    },
    description: {
      en: "Support teachers in classroom activities and gain valuable teaching experience. Work with students of various ages and contribute to creating an engaging learning environment.",
      da: "از معلمان در فعالیت‌های کلاسی حمایت کنید و تجربه ارزشمند تدریس کسب کنید. با دانش‌آموزان سنین مختلف کار کنید و در ایجاد محیط یادگیری جذاب سهیم شوید.",
      pa: "په ټولګي فعالیتونو کې د ښوونکو ملاتړ وکړئ او ارزښتناکه تدریسي تجربه ترلاسه کړئ. د مختلفو عمرونو زده کوونکو سره کار وکړئ او د ښکیلونکي زده کړې چاپیریال په جوړولو کې ونډه واخلئ.",
    },
    requirements: {
      en: "Basic knowledge of HTML, CSS, and JavaScript; Enthusiasm to learn and grow",
      da: "دانش اولیه HTML، CSS و JavaScript; اشتیاق برای یادگیری و رشد",
      pa: "د HTML، CSS او JavaScript اساسي پوهه; د زده کړې او وده کولو لیوالتیا",
    },

    benefits: {
      en: "Mentorship from senior developers, Certificate upon completion",
      da: "راهنمایی از توسعه‌دهندگان ارشد, گواهینامه پس از تکمیل",
      pa: "د بشپړیدو په وخت سند, د لوړ پوړو پراختیا کونکو څخه لارښوونه",
    },
    contactEmail: "info@futureminds.af",
    contactPhone: "+93 700 345 678",
    startDate: "2026-02-15",
    applicationDeadline: "2026-02-05",
    isActive: true,
    image: "images/product-2.jpg",
  },
  {
    id: "4",
    title: {
      en: "Civil Engineering Trainee",
      da: "کارآموز مهندسی عمران",
      pa: "د ساختماني انجینرۍ روزونکی",
    },
    organization: {
      en: "Afghanistan Construction Group",
      da: "گروه ساختمانی افغانستان",
      pa: "د افغانستان ساختماني ګروپ",
    },
    categoryId: "engineering",
    duration: {
      en: "5 months",
      da: "۵ ماه",
      pa: "۵ میاشتې",
    },
    location: {
      en: "Mazar-i-Sharif, Afghanistan",
      da: "مزار شریف، افغانستان",
      pa: "مزار شریف، افغانستان",
    },
    description: {
      en: "Participate in infrastructure projects and learn about construction planning, site management, and engineering principles. Get practical exposure to real-world civil engineering challenges.",
      da: "در پروژه‌های زیربنایی شرکت کنید و در مورد برنامه‌ریزی ساختمان، مدیریت سایت و اصول مهندسی یاد بگیرید. با چالش‌های واقعی مهندسی عمران آشنا شوید.",
      pa: "په زیربنایي پروژو کې برخه واخلئ او د ساختمان پلان جوړونې، د ساحې مدیریت او انجینري اصولو په اړه زده کړه وکړئ. د ساختماني انجینرۍ ریښتینو ننګونو ته عملي پام وکړئ.",
    },
    requirements: {
      en: "Basic knowledge of HTML, CSS, and JavaScript; Enthusiasm to learn and grow",
      da: "دانش اولیه HTML، CSS و JavaScript; اشتیاق برای یادگیری و رشد",
      pa: "د HTML، CSS او JavaScript اساسي پوهه; د زده کړې او وده کولو لیوالتیا",
    },

    benefits: {
      en: "Mentorship from senior developers, Certificate upon completion",
      da: "راهنمایی از توسعه‌دهندگان ارشد, گواهینامه پس از تکمیل",
      pa: "د بشپړیدو په وخت سند, د لوړ پوړو پراختیا کونکو څخه لارښوونه",
    },
    contactEmail: "jobs@acg.af",
    contactPhone: "+93 700 456 789",
    startDate: "2026-03-15",
    applicationDeadline: "2026-02-28",
    isActive: true,
    image: "images/bg-3.jpg",
  },
  {
    id: "5",
    title: {
      en: "Business Administration Intern",
      da: "کارآموز اداره تجارت",
      pa: "د سوداګرۍ اداری کارموزي",
    },
    organization: {
      en: "Afghan Trade Solutions",
      da: "راه‌حل‌های تجارتی افغان",
      pa: "د افغان سوداګرۍ حلونه",
    },
    categoryId: "business",
    duration: {
      en: "3 months",
      da: "۳ ماه",
      pa: "۳ میاشتې",
    },
    location: {
      en: "Kabul, Afghanistan",
      da: "کابل، افغانستان",
      pa: "کابل، افغانستان",
    },
    description: {
      en: "Gain practical business experience in operations, marketing, and customer relations. Learn about business strategies, financial management, and professional communication in a dynamic environment.",
      da: "تجربه تجاری عملی در عملیات، بازاریابی و روابط مشتری کسب کنید. در مورد استراتژی‌های تجاری، مدیریت مالی و ارتباطات حرفه‌ای در یک محیط پویا یاد بگیرید.",
      pa: "په عملیاتو، بازار موندنه او د پیرودونکو اړیکو کې عملي سوداګریزه تجربه ترلاسه کړئ. په متحرک چاپیریال کې د سوداګرۍ ستراتیژیو، مالي مدیریت او مسلکي اړیکو په اړه زده کړه وکړئ.",
    },
    requirements: {
      en: "Basic knowledge of HTML, CSS, and JavaScript; Enthusiasm to learn and grow",
      da: "دانش اولیه HTML، CSS و JavaScript; اشتیاق برای یادگیری و رشد",
      pa: "د HTML، CSS او JavaScript اساسي پوهه; د زده کړې او وده کولو لیوالتیا",
    },

    benefits: {
      en: "Mentorship from senior developers, Certificate upon completion",
      da: "راهنمایی از توسعه‌دهندگان ارشد, گواهینامه پس از تکمیل",
      pa: "د بشپړیدو په وخت سند, د لوړ پوړو پراختیا کونکو څخه لارښوونه",
    },
    contactEmail: "internships@afghantrade.af",
    contactPhone: "+93 700 567 890",
    startDate: "2026-02-20",
    applicationDeadline: "2026-02-10",
    isActive: true,
    image: "images/bg-2.jpg",
  },
  {
    id: "6",
    title: {
      en: "Digital Media Intern",
      da: "کارآموز رسانه‌های دیجیتال",
      pa: "د ډیجیټل رسنیو کارموزي",
    },
    organization: {
      en: "Afghan Media Network",
      da: "شبکه رسانه‌ای افغان",
      pa: "د افغان رسنیو شبکه",
    },
    categoryId: "media",
    duration: {
      en: "4 months",
      da: "۴ ماه",
      pa: "۴ میاشتې",
    },
    location: {
      en: "Kabul, Afghanistan",
      da: "کابل، افغانستان",
      pa: "کابل، افغانستان",
    },
    description: {
      en: "Work with our creative team on social media management, content creation, and digital marketing. Learn about multimedia production, storytelling, and audience engagement in the digital age.",
      da: "با تیم خلاق ما در مدیریت رسانه‌های اجتماعی، ایجاد محتوا و بازاریابی دیجیتال کار کنید. در مورد تولید چند رسانه‌ای، داستان‌سرایی و تعامل مخاطبان در عصر دیجیتال یاد بگیرید.",
      pa: "زموږ د خلاق ټیم سره د ټولنیزو رسنیو مدیریت، منځپانګې جوړولو او ډیجیټل بازار موندنه کې کار وکړئ. په ډیجیټل دور کې د ملټي میډیا تولید، کیسه ویلو او د لیدونکو ښکیلتیا په اړه زده کړه وکړئ.",
    },
    requirements: {
      en: "Basic knowledge of HTML, CSS, and JavaScript; Enthusiasm to learn and grow",
      da: "دانش اولیه HTML، CSS و JavaScript; اشتیاق برای یادگیری و رشد",
      pa: "د HTML، CSS او JavaScript اساسي پوهه; د زده کړې او وده کولو لیوالتیا",
    },

    benefits: {
      en: "Mentorship from senior developers, Certificate upon completion",
      da: "راهنمایی از توسعه‌دهندگان ارشد, گواهینامه پس از تکمیل",
      pa: "د بشپړیدو په وخت سند, د لوړ پوړو پراختیا کونکو څخه لارښوونه",
    },
    contactEmail: "media@afghannetwork.af",
    contactPhone: "+93 700 678 901",
    startDate: "2026-03-01",
    applicationDeadline: "2026-02-20",
    isActive: true,
    image: "images/bg-1.jpg",
  },
];
