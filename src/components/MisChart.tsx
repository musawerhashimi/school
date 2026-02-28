import { useState } from "react";

// const data = {
//   modules: [
//     {
//       id: "finance",
//       title: "Finance Management",
//       icon: "💰",
//       navActive: "border-b-emerald-400 text-white bg-emerald-400/10",
//       headerBorder: "border-emerald-500/30",
//       headerGlow: "text-emerald-400",
//       sectionTitle: "text-emerald-300",
//       bullet: "text-emerald-500",
//       chevronOpen: "bg-emerald-500/20 text-emerald-300",
//       sections: [
//         {
//           title: "Income Management",
//           icon: "📥",
//           subsections: [
//             {
//               label: "Student-Related Income",
//               details: [
//                 "Monthly Tuition Fees",
//                 "Registration Fees",
//                 "Late Payment Fines",
//                 "Transport Fees",
//                 "Custom Fees (lab, exam)",
//               ],
//             },
//             {
//               label: "Product Sales",
//               details: [
//                 "Books",
//                 "Student ID Cards",
//                 "Uniform",
//                 "Stationery",
//                 "Other school products",
//               ],
//             },
//             {
//               label: "Other Income",
//               details: [
//                 "Donations",
//                 "Event Income",
//                 "Miscellaneous (categorized)",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Discount & Scholarship",
//           icon: "🏷️",
//           subsections: [
//             {
//               label: "Discount Types",
//               details: [
//                 "Percentage discounts",
//                 "Fixed-amount discounts",
//                 "Sibling discounts",
//                 "Scholarship students",
//                 "Custom discount per student",
//                 "Month-specific adjustments",
//               ],
//             },
//             {
//               label: "Audit Trail",
//               details: [
//                 "Recorded with reason",
//                 "Traceable in reports",
//                 "Reflected in billing",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Payment Handling",
//           icon: "💳",
//           subsections: [
//             {
//               label: "Partial Payments",
//               details: [
//                 "Allocates to oldest unpaid month",
//                 "Tracks remaining balance per month",
//               ],
//             },
//             {
//               label: "Advance Payments",
//               details: [
//                 "Multi-month advance support",
//                 "Credit balance stored",
//                 "Auto-deducted from future bills",
//               ],
//             },
//             {
//               label: "Refund Management",
//               details: [
//                 "Student leaves school",
//                 "Overpayment occurs",
//                 "Reflected in reports & balance",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Billing System",
//           icon: "🧾",
//           subsections: [
//             {
//               label: "Bill Contents",
//               details: [
//                 "Student & Father Name",
//                 "Class & Academic Year",
//                 "Month & Amount Due",
//                 "Previous unpaid months",
//                 "Total outstanding balance",
//                 "Discount & Fine applied",
//               ],
//             },
//             {
//               label: "Bill Status",
//               details: ["Draft", "Sent", "Partially Paid", "Paid", "Overdue"],
//             },
//             {
//               label: "Delivery",
//               details: ["Print", "System send", "WhatsApp integration"],
//             },
//           ],
//         },
//         {
//           title: "Payment Receipt",
//           icon: "✅",
//           subsections: [
//             {
//               label: "Receipt Fields",
//               details: [
//                 "Receipt Number",
//                 "Student & Father Name",
//                 "Class",
//                 "Amount Paid",
//                 "Payment Date & Time",
//                 "Payment Method",
//                 "Remaining Balance",
//                 "Officer Name",
//               ],
//             },
//             { label: "Formats", details: ["Digital copy", "Printable copy"] },
//           ],
//         },
//         {
//           title: "Expense Management",
//           icon: "📤",
//           subsections: [
//             {
//               label: "Operational",
//               details: [
//                 "Rent",
//                 "Electricity",
//                 "Water",
//                 "Internet",
//                 "Taxes (Maliat)",
//                 "Maintenance",
//               ],
//             },
//             {
//               label: "Administrative",
//               details: [
//                 "Paper",
//                 "Ink",
//                 "Office supplies",
//                 "Department annual budget tracking",
//               ],
//             },
//             {
//               label: "Asset & Depreciation",
//               details: [
//                 "Computers, Furniture, Equipment",
//                 "Defined lifespan (e.g. 3 years)",
//                 "Automatic depreciation calculation",
//                 "Depreciation expense reporting",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Cash & Bank Tracking",
//           icon: "🏦",
//           subsections: [
//             {
//               label: "Tracked Separately",
//               details: ["Office Cashbox", "Bank Account"],
//             },
//             {
//               label: "Reports Include",
//               details: [
//                 "Current cash balance",
//                 "Current bank balance",
//                 "Total available funds",
//                 "Transaction history",
//                 "Full audit control",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Salary Management",
//           icon: "👔",
//           subsections: [
//             {
//               label: "Salary Structure",
//               details: [
//                 "Basic Salary",
//                 "Allowances & Bonuses",
//                 "Deductions",
//                 "Salary Advance",
//                 "Tax deduction",
//                 "Absence/Late penalties",
//               ],
//             },
//             {
//               label: "Salary Bill (2 copies)",
//               details: [
//                 "School archive copy",
//                 "Staff copy",
//                 "Staff Name, Position, Month",
//                 "Net Amount, Date, Signature",
//               ],
//             },
//             {
//               label: "Payslip",
//               details: [
//                 "Salary breakdown",
//                 "Deductions & Advances",
//                 "Net Salary",
//                 "Official formatting",
//               ],
//             },
//             {
//               label: "Payroll Locking",
//               details: [
//                 "Locked after finalization",
//                 "No modification without authorized override",
//                 "Ensures financial integrity",
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "reporting",
//       title: "Reporting System",
//       icon: "📊",
//       navActive: "border-b-violet-400 text-white bg-violet-400/10",
//       headerBorder: "border-violet-500/30",
//       headerGlow: "text-violet-400",
//       sectionTitle: "text-violet-300",
//       bullet: "text-violet-500",
//       chevronOpen: "bg-violet-500/20 text-violet-300",
//       sections: [
//         {
//           title: "Financial Reports",
//           icon: "📈",
//           subsections: [
//             {
//               label: "Periods",
//               details: ["Daily", "Monthly", "Quarterly", "Annual"],
//             },
//             {
//               label: "Metrics",
//               details: [
//                 "Total Income",
//                 "Total Expenses",
//                 "Profit",
//                 "Net Profit",
//                 "Income by source",
//                 "Expense by category",
//                 "Cash vs Bank balance",
//               ],
//             },
//             { label: "Export Formats", details: ["PDF", "Excel"] },
//           ],
//         },
//         {
//           title: "Government Report",
//           icon: "🏛️",
//           subsections: [
//             {
//               label: "Includes Only",
//               details: ["Tuition Fees", "Registration Fees"],
//             },
//             {
//               label: "Compliance",
//               details: [
//                 "Prepared per official requirements",
//                 "Special formatted template",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Fee Reports",
//           icon: "💵",
//           subsections: [
//             {
//               label: "Available Reports",
//               details: [
//                 "Pending Fee Report",
//                 "Class-wise Pending",
//                 "Parent-wise Report",
//                 "Student Payment History",
//                 "Discount Summary Report",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Salary Reports",
//           icon: "💼",
//           subsections: [
//             {
//               label: "Available Reports",
//               details: [
//                 "Monthly Payroll Report",
//                 "Annual Salary Summary",
//                 "Department Salary Report",
//                 "Salary Advance Report",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Admin & Operational Reports",
//           icon: "📋",
//           subsections: [
//             {
//               label: "Available Reports",
//               details: [
//                 "Class Report",
//                 "Student Report",
//                 "Parent Report",
//                 "Department Expense Report",
//                 "Asset Depreciation Report",
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "viceprincipal",
//       title: "Vice Principal Module",
//       icon: "🎓",
//       navActive: "border-b-rose-400 text-white bg-rose-400/10",
//       headerBorder: "border-rose-500/30",
//       headerGlow: "text-rose-400",
//       sectionTitle: "text-rose-300",
//       bullet: "text-rose-500",
//       chevronOpen: "bg-rose-500/20 text-rose-300",
//       sections: [
//         {
//           title: "Academic Documents",
//           icon: "📄",
//           subsections: [
//             {
//               label: "Official Documents",
//               details: [
//                 "Etelah Nama (professional template)",
//                 "Jadwal Nataije",
//                 "Failed Students List",
//                 "Mashroot Students List",
//                 "Three-Year Score Record",
//                 "Sea Parcha Entry/Exit List",
//                 "Jadid Shumoul (New Students) Report",
//               ],
//             },
//             {
//               label: "Document Features",
//               details: ["Official printable templates", "System-generated"],
//             },
//           ],
//         },
//         {
//           title: "Promotion & Year Management",
//           icon: "🔄",
//           subsections: [
//             {
//               label: "Features",
//               details: [
//                 "Automatic class promotion",
//                 "Academic year separation",
//                 "Student academic history preserved",
//                 "Pass / Fail / Mashroot status tracking",
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "attendance",
//       title: "Attendance (Biometric)",
//       icon: "👁️",
//       navActive: "border-b-amber-400 text-white bg-amber-400/10",
//       headerBorder: "border-amber-500/30",
//       headerGlow: "text-amber-400",
//       sectionTitle: "text-amber-300",
//       bullet: "text-amber-500",
//       chevronOpen: "bg-amber-500/20 text-amber-300",
//       sections: [
//         {
//           title: "Student Attendance",
//           icon: "🧒",
//           subsections: [
//             {
//               label: "Tracking",
//               details: [
//                 "Daily attendance tracking",
//                 "In/Out time recording",
//                 "Auto-generation from biometric device",
//                 "Late arrival detection",
//                 "Early departure detection",
//                 "Auto-absent logic",
//               ],
//             },
//             {
//               label: "Parent Notifications",
//               details: [
//                 "Arrival notification",
//                 "Departure notification",
//                 "Absence notification",
//                 "Via system & WhatsApp integration",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Staff Attendance",
//           icon: "👩‍🏫",
//           subsections: [
//             {
//               label: "Features",
//               details: [
//                 "Biometric check-in/out",
//                 "Late tracking",
//                 "Attendance reports",
//                 "Absence calculation for salary deduction",
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "exams",
//       title: "Question Bank & Exams",
//       icon: "📝",
//       navActive: "border-b-cyan-400 text-white bg-cyan-400/10",
//       headerBorder: "border-cyan-500/30",
//       headerGlow: "text-cyan-400",
//       sectionTitle: "text-cyan-300",
//       bullet: "text-cyan-500",
//       chevronOpen: "bg-cyan-500/20 text-cyan-300",
//       sections: [
//         {
//           title: "Question Bank",
//           icon: "🗃️",
//           subsections: [
//             {
//               label: "Organization",
//               details: [
//                 "Subject-wise categorization",
//                 "Class-wise filtering",
//                 "Difficulty tagging",
//                 "Question type support",
//               ],
//             },
//           ],
//         },
//         {
//           title: "Exam Paper Generator",
//           icon: "⚙️",
//           subsections: [
//             {
//               label: "Features",
//               details: [
//                 "Randomized question selection",
//                 "Blueprint-based generation (easy/medium/hard ratio)",
//                 "Printable exam format",
//                 "Secure storage",
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       id: "lifecycle",
//       title: "Student Lifecycle",
//       icon: "🌱",
//       navActive: "border-b-purple-400 text-white bg-purple-400/10",
//       headerBorder: "border-purple-500/30",
//       headerGlow: "text-purple-400",
//       sectionTitle: "text-purple-300",
//       bullet: "text-purple-500",
//       chevronOpen: "bg-purple-500/20 text-purple-300",
//       sections: [
//         {
//           title: "Lifecycle Stages",
//           icon: "🔁",
//           subsections: [
//             {
//               label: "Supported Actions",
//               details: [
//                 "Admission",
//                 "Registration",
//                 "Transfer",
//                 "Dropout",
//                 "Suspension",
//                 "Graduation",
//               ],
//             },
//             {
//               label: "Reflected In",
//               details: ["Finance", "Attendance", "Academic history"],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// } as const;
const data = {
  modules: [
    {
      id: "finance",
      title: "مدیریت مالی",
      icon: "💰",
      navActive: "border-b-emerald-400 text-white bg-emerald-400/10",
      headerBorder: "border-emerald-500/30",
      headerGlow: "text-emerald-400",
      sectionTitle: "text-emerald-300",
      bullet: "text-emerald-500",
      chevronOpen: "bg-emerald-500/20 text-emerald-300",
      sections: [
        {
          title: "مدیریت عواید",
          icon: "📥",
          subsections: [
            {
              label: "عواید مربوط به شاگردان",
              details: [
                "فیس ماهانه",
                "فیس ثبت‌نام",
                "جریمه تأخیر پرداخت",
                "فیس ترانسپورت",
                "فیس‌های اختصاصی (لابراتوار، امتحان)",
              ],
            },
            {
              label: "فروش محصولات",
              details: [
                "کتاب‌ها",
                "کارت شاگردی",
                "یونیفورم",
                "لوازم تحریر",
                "سایر محصولات مکتب",
              ],
            },
            {
              label: "سایر عواید",
              details: [
                "کمک‌های مالی (اعانه)",
                "عواید برنامه‌ها",
                "متفرقه (دسته‌بندی‌شده)",
              ],
            },
          ],
        },
        {
          title: "تخفیف و بورس",
          icon: "🏷️",
          subsections: [
            {
              label: "انواع تخفیف",
              details: [
                "تخفیف فیصدی",
                "تخفیف مبلغ ثابت",
                "تخفیف خواهر و برادر",
                "شاگردان بورس",
                "تخفیف اختصاصی برای هر شاگرد",
                "تنظیمات مخصوص یک ماه خاص",
              ],
            },
            {
              label: "ثبت سوابق",
              details: [
                "ثبت همراه با دلیل",
                "قابل پیگیری در راپورها",
                "منعکس در بل",
              ],
            },
          ],
        },
        {
          title: "مدیریت پرداخت",
          icon: "💳",
          subsections: [
            {
              label: "پرداخت قسمی",
              details: [
                "اختصاص به قدیمی‌ترین ماه پرداخت‌نشده",
                "ثبت باقی‌مانده هر ماه",
              ],
            },
            {
              label: "پیش‌پرداخت",
              details: [
                "حمایت از پرداخت چندماهه",
                "ذخیره بیلانس اعتباری",
                "کسر خودکار از بل‌های آینده",
              ],
            },
            {
              label: "مدیریت بازپرداخت",
              details: [
                "در صورت ترک مکتب توسط شاگرد",
                "در صورت پرداخت اضافی",
                "منعکس در راپور و بیلانس",
              ],
            },
          ],
        },
        {
          title: "سیستم بل",
          icon: "🧾",
          subsections: [
            {
              label: "محتویات بل",
              details: [
                "نام شاگرد و پدر",
                "صنف و سال تعلیمی",
                "ماه و مبلغ قابل پرداخت",
                "ماه‌های قبلی پرداخت‌نشده",
                "مجموع بیلانس باقی‌مانده",
                "تخفیف و جریمه اعمال‌شده",
              ],
            },
            {
              label: "وضعیت بل",
              details: [
                "پیش‌نویس",
                "ارسال‌شده",
                "قسمی پرداخت‌شده",
                "پرداخت‌شده",
                "پرداخت‌نشده",
              ],
            },
            {
              label: "ارسال",
              details: ["چاپ", "ارسال سیستمی", "ادغام با واتساپ"],
            },
          ],
        },
        {
          title: "رسید پرداخت",
          icon: "✅",
          subsections: [
            {
              label: "مشخصات رسید",
              details: [
                "نمبر رسید",
                "نام شاگرد و پدر",
                "صنف",
                "مبلغ پرداخت‌شده",
                "تاریخ و زمان پرداخت",
                "روش پرداخت",
                "بیلانس باقی‌مانده",
                "نام مسئول",
              ],
            },
            {
              label: "فرمت‌ها",
              details: ["نسخه دیجیتلی", "نسخه قابل چاپ"],
            },
          ],
        },
        {
          title: "مدیریت مصارف",
          icon: "📤",
          subsections: [
            {
              label: "مصارف عملیاتی",
              details: [
                "کرایه",
                "برق",
                "آب",
                "انترنت",
                "مالیات",
                "ترمیم و نگهداری",
              ],
            },
            {
              label: "مصارف اداری",
              details: [
                "کاغذ",
                "رنگ چاپ",
                "لوازم دفتری",
                "پیگیری بودجه سالانه هر بخش",
              ],
            },
            {
              label: "دارایی و استهلاک",
              details: [
                "کمپیوترها، فرنیچر، تجهیزات",
                "عمر مفید تعریف‌شده (مثلاً ۳ سال)",
                "محاسبه خودکار استهلاک",
                "گزارش مصارف استهلاک",
              ],
            },
          ],
        },
        {
          title: "مدیریت صندوق و بانک",
          icon: "🏦",
          subsections: [
            {
              label: "ثبت جداگانه",
              details: ["صندوق دفتر", "حساب بانکی"],
            },
            {
              label: "راپورها شامل",
              details: [
                "بیلانس فعلی صندوق",
                "بیلانس فعلی بانک",
                "مجموع وجوه موجود",
                "تاریخچه تراکنش‌ها",
                "کنترول کامل حسابرسی",
              ],
            },
          ],
        },
        {
          title: "مدیریت معاشات",
          icon: "👔",
          subsections: [
            {
              label: "ساختار معاش",
              details: [
                "معاش اساسی",
                "امتیازات و بونس",
                "کسورات",
                "پیش‌پرداخت معاش",
                "کسر مالیات",
                "جریمه غیابت/تأخیر",
              ],
            },
            {
              label: "بل معاش (۲ نسخه)",
              details: [
                "نسخه آرشیف مکتب",
                "نسخه کارمند",
                "نام کارمند، بست، ماه",
                "مبلغ خالص، تاریخ، امضا",
              ],
            },
            {
              label: "ورقه معاش",
              details: [
                "تفکیک معاش",
                "کسورات و پیش‌پرداخت‌ها",
                "معاش خالص",
                "فرمت رسمی",
              ],
            },
            {
              label: "قفل سیستم معاش",
              details: [
                "قفل بعد از نهایی‌شدن",
                "عدم امکان تغییر بدون صلاحیت خاص",
                "تضمین شفافیت مالی",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "reporting",
      title: "سیستم راپورگیری",
      icon: "📊",
      navActive: "border-b-violet-400 text-white bg-violet-400/10",
      headerBorder: "border-violet-500/30",
      headerGlow: "text-violet-400",
      sectionTitle: "text-violet-300",
      bullet: "text-violet-500",
      chevronOpen: "bg-violet-500/20 text-violet-300",
      sections: [
        {
          title: "راپورهای مالی",
          icon: "📈",
          subsections: [
            {
              label: "دوره‌ها",
              details: ["روزانه", "ماهانه", "ربع‌وار", "سالانه"],
            },
            {
              label: "شاخص‌ها",
              details: [
                "مجموع عواید",
                "مجموع مصارف",
                "مفاد",
                "مفاد خالص",
                "عواید بر اساس منبع",
                "مصارف بر اساس دسته‌بندی",
                "بیلانس صندوق و بانک",
              ],
            },
            {
              label: "فرمت خروجی",
              details: ["PDF", "اکسل"],
            },
          ],
        },
        {
          title: "راپور دولتی",
          icon: "🏛️",
          subsections: [
            {
              label: "شامل فقط",
              details: ["فیس ماهانه", "فیس ثبت‌نام"],
            },
            {
              label: "مطابقت رسمی",
              details: ["آماده‌شده مطابق مقررات رسمی", "قالب ویژه دولتی"],
            },
          ],
        },
        {
          title: "راپور فیس",
          icon: "💵",
          subsections: [
            {
              label: "راپورهای موجود",
              details: [
                "راپور فیس‌های پرداخت نشده",
                "پرداخت نشده بر اساس صنف",
                "راپور بر اساس ولی",
                "تاریخچه پرداخت شاگرد",
                "راپور خلاصه تخفیف‌ها",
              ],
            },
          ],
        },
        {
          title: "راپور معاشات",
          icon: "💼",
          subsections: [
            {
              label: "راپورهای موجود",
              details: [
                "راپور ماهانه معاشات",
                "خلاصه سالانه معاش",
                "راپور معاش بر اساس دیپارتمنت",
                "راپور پیش‌پرداخت معاش",
              ],
            },
          ],
        },
        {
          title: "راپورهای اداری و عملیاتی",
          icon: "📋",
          subsections: [
            {
              label: "راپورهای موجود",
              details: [
                "راپور صنف",
                "راپور شاگرد",
                "راپور ولی",
                "راپور مصارف دیپارتمنت",
                "راپور استهلاک دارایی",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "viceprincipal",
      title: "بخش معاونیت",
      icon: "🎓",
      navActive: "border-b-rose-400 text-white bg-rose-400/10",
      headerBorder: "border-rose-500/30",
      headerGlow: "text-rose-400",
      sectionTitle: "text-rose-300",
      bullet: "text-rose-500",
      chevronOpen: "bg-rose-500/20 text-rose-300",
      sections: [
        {
          title: "اسناد تعلیمی",
          icon: "📄",
          subsections: [
            {
              label: "اسناد رسمی",
              details: [
                "اطلاع‌نامه (قالب حرفه‌ای)",
                "جدول نتایج",
                "لست شاگردان ناکام",
                "لست شاگردان مشروط",
                "کارنامه سه‌ساله",
                "لیست داخل/خارج سی‌پارچه",
                "راپور شاگردان جدیدالشمول",
              ],
            },
            {
              label: "ویژگی‌ها",
              details: ["قالب رسمی قابل چاپ", "تولید خودکار توسط سیستم"],
            },
          ],
        },
        {
          title: "ارتقا و مدیریت سال تعلیمی",
          icon: "🔄",
          subsections: [
            {
              label: "ویژگی‌ها",
              details: [
                "ارتقای خودکار صنف",
                "تفکیک سال تعلیمی",
                "حفظ تاریخچه تعلیمی شاگرد",
                "ثبت وضعیت کامیاب / ناکام / مشروط",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "attendance",
      title: "حاضری (بایومتریک)",
      icon: "👁️",
      navActive: "border-b-amber-400 text-white bg-amber-400/10",
      headerBorder: "border-amber-500/30",
      headerGlow: "text-amber-400",
      sectionTitle: "text-amber-300",
      bullet: "text-amber-500",
      chevronOpen: "bg-amber-500/20 text-amber-300",
      sections: [
        {
          title: "حاضری شاگردان",
          icon: "🧒",
          subsections: [
            {
              label: "ثبت و پیگیری",
              details: [
                "ثبت حاضری روزانه",
                "ثبت زمان ورود و خروج",
                "تولید خودکار از دستگاه بایومتریک",
                "تشخیص تأخیر",
                "تشخیص خروج زودهنگام",
                "ثبت خودکار غیابت",
              ],
            },
            {
              label: "اطلاع‌رسانی به والدین",
              details: [
                "اطلاع رسیدن",
                "اطلاع خروج",
                "اطلاع غیابت",
                "از طریق سیستم و واتساپ",
              ],
            },
          ],
        },
        {
          title: "حاضری کارمندان",
          icon: "👩‍🏫",
          subsections: [
            {
              label: "ویژگی‌ها",
              details: [
                "ورود و خروج بایومتریک",
                "پیگیری تأخیر",
                "راپور حاضری",
                "محاسبه غیابت برای کسر معاش",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "exams",
      title: "بانک سوالات و امتحانات",
      icon: "📝",
      navActive: "border-b-cyan-400 text-white bg-cyan-400/10",
      headerBorder: "border-cyan-500/30",
      headerGlow: "text-cyan-400",
      sectionTitle: "text-cyan-300",
      bullet: "text-cyan-500",
      chevronOpen: "bg-cyan-500/20 text-cyan-300",
      sections: [
        {
          title: "بانک سوالات",
          icon: "🗃️",
          subsections: [
            {
              label: "دسته‌بندی",
              details: [
                "دسته‌بندی بر اساس مضمون",
                "فلتر بر اساس صنف",
                "درجه‌بندی سطح دشواری",
                "پشتیبانی از انواع سوال",
              ],
            },
          ],
        },
        {
          title: "تولیدکننده سوال امتحان",
          icon: "⚙️",
          subsections: [
            {
              label: "ویژگی‌ها",
              details: [
                "انتخاب تصادفی سوالات",
                "تولید بر اساس بلواپرینت (آسان/متوسط/دشوار)",
                "فرمت قابل چاپ امتحان",
                "ذخیره امن",
              ],
            },
          ],
        },
      ],
    },

    {
      id: "lifecycle",
      title: "چرخه حیات شاگرد",
      icon: "🌱",
      navActive: "border-b-purple-400 text-white bg-purple-400/10",
      headerBorder: "border-purple-500/30",
      headerGlow: "text-purple-400",
      sectionTitle: "text-purple-300",
      bullet: "text-purple-500",
      chevronOpen: "bg-purple-500/20 text-purple-300",
      sections: [
        {
          title: "مراحل چرخه حیات",
          icon: "🔁",
          subsections: [
            {
              label: "عملیات پشتیبانی‌شده",
              details: [
                "پذیرش",
                "ثبت‌نام",
                "انتقال",
                "ترک تحصیل",
                "تعلیق",
                "فراغت",
              ],
            },
            {
              label: "منعکس در",
              details: ["مالی", "حاضری", "تاریخچه تعلیمی"],
            },
          ],
        },
      ],
    },
  ],
} as const;
type Module = (typeof data.modules)[number];

export default function SchoolMIS() {
  const [activeModule, setActiveModule] = useState<string>(data.modules[0].id);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [expandedSubs, setExpandedSubs] = useState<Record<string, boolean>>({});

  const currentModule = data.modules.find(
    (m) => m.id === activeModule,
  ) as Module;

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleSub = (key: string) =>
    setExpandedSubs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-slate-200 text-slate-200 text-start">
      {/* ── Header ── */}
      <header className="mt-20 bg-gradient-to-br from-primary via-secondary/20 to-accent border-b border-[#1E1E3A] px-8 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
        <h1 className="text-3xl text-end sm:text-4xl font-bold tracking-widest text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.5)] uppercase">
          🏫 SCHOOL MIS Phase 2
        </h1>
      </header>

      {/* ── Module Nav ── */}
      <nav className="flex overflow-x-auto bg-[#0D0D1A] border-b border-[#1A1A30] scrollbar-none">
        {data.modules.map((mod) => (
          <button
            key={mod.id}
            onClick={() => setActiveModule(mod.id)}
            className={[
              "flex-shrink-0 flex flex-col items-center gap-1 px-5 py-4 border-b-2 text-[11px] tracking-widest uppercase font-semibold transition-all duration-200 whitespace-nowrap",
              activeModule === mod.id
                ? mod.navActive
                : "border-b-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5",
            ].join(" ")}
          >
            <span className="text-base text-start">{mod.icon}</span>
            <span className="text-xl">{mod.title}</span>
          </button>
        ))}
      </nav>

      {/* ── Content ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Module Header */}
        <div
          className={[
            "flex items-center gap-5 mb-8 px-6 py-5 rounded-2xl border relative overflow-hidden",
            currentModule.headerBorder,
          ].join(" ")}
        >
          <div className="absolute inset-0 bg-card" />
          <span className="text-4xl relative z-10">{currentModule.icon}</span>
          <div className="relative z-10">
            <h2
              className={`text-2xl  text-start font-bold tracking-wide ${currentModule.headerGlow}`}
            >
              {currentModule.title}
            </h2>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentModule.sections.map((section, si) => {
            const sKey = `${activeModule}-${si}`;
            const isOpen = expandedSections[sKey] !== false;

            return (
              <div
                key={sKey}
                className="rounded-2xl border border-[#1E1E3A] bg-card overflow-hidden hover:border-white/10 hover:shadow-2xl transition-all duration-200"
              >
                {/* Section Header */}
                <div
                  className={[
                    "flex items-center gap-3 px-5 py-4 cursor-pointer select-none bg-white/[0.02] hover:bg-white/[0.04] transition-colors",
                    isOpen ? "border-b border-[#1A1A30]" : "",
                  ].join(" ")}
                  onClick={() => toggleSection(sKey)}
                >
                  <span className="text-xl text-start flex-shrink-0">
                    {section.icon}
                  </span>
                  <span
                    className={`flex-1 text-md text-start font-semibold tracking-widest uppercase ${currentModule.sectionTitle}`}
                  >
                    {section.title}
                  </span>
                  <span
                    className={[
                      "w-6 h-6 rounded-full flex items-center justify-center text-md transition-all duration-200",
                      isOpen
                        ? currentModule.chevronOpen
                        : "bg-red/5 text-red-500",
                      isOpen ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    ▼
                  </span>
                </div>

                {/* Section Body */}
                {isOpen && (
                  <div className="px-5 pb-4">
                    {section.subsections.map((sub, subi) => {
                      const subKey = `${sKey}-${subi}`;
                      const subOpen = expandedSubs[subKey] !== false;

                      return (
                        <div
                          key={subKey}
                          className="mt-4 rounded-xl bg-white/[0.02] border border-[#181828] overflow-hidden"
                        >
                          {/* Subsection Header */}
                          <div
                            className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer select-none hover:bg-white/[0.03] transition-colors"
                            onClick={() => toggleSub(subKey)}
                          >
                            <span className="text-sm text-start font-semibold text-primary">
                              {sub.label}
                            </span>
                            <span className="text-xs text-start text-slate-600 bg-white/[0.03] border border-[#222240] px-2 py-0.5 rounded-full flex-shrink-0">
                              {sub.details.length} items
                            </span>
                          </div>

                          {/* Detail List */}
                          {subOpen && (
                            <ul className="px-4 pb-3 pt-2 border-t border-[#181828] space-y-1">
                              {sub.details.map((d, di) => (
                                <li
                                  key={di}
                                  className="flex items-start text-start gap-2.5 text-sm text-slate-500 leading-relaxed"
                                >
                                  <span
                                    className={`${currentModule.bullet} text-[6px] mt-[7px] flex-shrink-0`}
                                  >
                                    ◆
                                  </span>
                                  {d}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
