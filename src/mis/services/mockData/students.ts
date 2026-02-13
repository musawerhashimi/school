export interface Student {
  id: string;
  studentId: string;

  // Personal Information
  firstName: string;
  lastName: string;
  fatherName: string;
  name: string;
  dateOfBirth: string;
  gender: "male" | "female";
  nationality: string;
  religion?: string;
  bloodGroup?: string;
  photo?: string;

  // Contact Information
  address: string;
  city: string;
  province: string;
  phone?: string;
  email?: string;

  // Academic Information
  classId: string;
  className: string;
  section: string;
  rollNumber: string;
  admissionDate: string;
  academicYearId: string;
  status: "active" | "inactive" | "graduated" | "transferred" | "suspended";

  // Parent/Guardian Information
  parentId: string;
  parentName: string;
  parentRelation: "father" | "mother" | "guardian";
  parentContact: string;
  parentEmail?: string;
  parentOccupation?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Health Information
  medicalConditions?: string;
  allergies?: string;

  // Previous Education
  previousSchool?: string;
  previousClass?: string;
  transferCertificate?: string;

  // System
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

// Afghan male first names
const maleFirstNames = [
  "Ahmad",
  "Ali",
  "Hassan",
  "Hussein",
  "Omar",
  "Khalid",
  "Rashid",
  "Tariq",
  "Zabiullah",
  "Najibullah",
  "Hamidullah",
  "Abdullah",
  "Mohammad",
  "Fahim",
  "Karim",
  "Nasir",
  "Rahim",
  "Sami",
  "Wasim",
  "Yusuf",
  "Zahir",
  "Aziz",
  "Bilal",
  "Dawood",
  "Ehsan",
  "Farhan",
  "Ghulam",
  "Habib",
  "Ibrahim",
  "Javed",
];

// Afghan female first names
const femaleFirstNames = [
  "Fatima",
  "Aisha",
  "Maryam",
  "Zainab",
  "Khadija",
  "Hawa",
  "Nadia",
  "Parisa",
  "Rahila",
  "Saba",
  "Tahira",
  "Uzma",
  "Wahida",
  "Yasmin",
  "Zara",
  "Amina",
  "Bibi",
  "Dunya",
  "Elaha",
  "Farida",
  "Gulalai",
  "Halima",
  "Jamila",
  "Laila",
  "Madina",
  "Nazo",
  "Palwasha",
  "Rabia",
  "Shabana",
  "Tamana",
];

// Afghan last names
const lastNames = [
  "Khan",
  "Ahmadi",
  "Karimi",
  "Rezai",
  "Haidari",
  "Akbari",
  "Mohammadi",
  "Zoy",
  "Wardak",
  "Barakzai",
  "Popal",
  "Safi",
  "Nuristani",
  "Zadran",
  "Mangal",
  "Shinwari",
  "Durrani",
  "Ghilzai",
  "Yusufzai",
  "Niazi",
];

// Afghan provinces
const provinces = [
  "Kabul",
  "Ghazni",
  "Kandahar",
  "Herat",
  "Balkh",
  "Nangarhar",
  "Helmand",
  "Badakhshan",
  "Takhar",
  "Baghlan",
  "Parwan",
  "Logar",
  "Paktia",
  "Kunar",
];

// Afghan cities
const cities: Record<string, string[]> = {
  Kabul: ["Kabul City", "Paghman", "Char Asiab", "Bagrami"],
  Ghazni: ["Ghazni City", "Qarabagh", "Jaghori", "Andar"],
  Kandahar: ["Kandahar City", "Spin Boldak", "Arghandab", "Panjwayi"],
  Herat: ["Herat City", "Guzara", "Injil", "Karukh"],
  Balkh: ["Mazar-i-Sharif", "Balkh", "Dawlatabad", "Sholgara"],
};

// Blood groups
const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Classes for high school (9-12)
const classes = [
  { id: "c9", name: "Class 9", sections: ["A", "B", "C"] },
  { id: "c10", name: "Class 10", sections: ["A", "B", "C"] },
  { id: "c11", name: "Class 11", sections: ["A", "B"] },
  { id: "c12", name: "Class 12", sections: ["A", "B"] },
];

// Helper functions
const randomItem = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const randomDate = (start: Date, end: Date): string => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
};

const generatePhoneNumber = (): string => {
  const prefixes = ["070", "077", "078", "079"];
  const prefix = randomItem(prefixes);
  const number = Math.floor(1000000 + Math.random() * 9000000);
  return `${prefix}${number}`;
};

// Generate mock students
export function generateMockStudents(count: number = 80): Student[] {
  const students: Student[] = [];
  const currentYear = new Date().getFullYear();
  const academicYearId = `${currentYear}-${currentYear + 1}`;

  for (let i = 0; i < count; i++) {
    const gender: "male" | "female" = Math.random() > 0.5 ? "male" : "female";
    const firstName =
      gender === "male"
        ? randomItem(maleFirstNames)
        : randomItem(femaleFirstNames);
    const lastName = randomItem(lastNames);
    const fatherName = `${randomItem(maleFirstNames)} ${lastName}`;
    const name = `${firstName} ${lastName}`;

    const classInfo = randomItem(classes);
    const section = randomItem(classInfo.sections);
    const rollNumber = `${classInfo.id.toUpperCase()}-${section}-${String(
      (i % 30) + 1
    ).padStart(3, "0")}`;

    const province = randomItem(provinces);
    const cityList = cities[province] || [province];
    const city = randomItem(cityList);

    // Age between 14-18 for high school
    const age = 14 + Math.floor(Math.random() * 5);
    const birthYear = currentYear - age;
    const dateOfBirth = randomDate(
      new Date(birthYear, 0, 1),
      new Date(birthYear, 11, 31)
    );

    // Admission date (within last 1-4 years)
    const yearsAgo = Math.floor(Math.random() * 4) + 1;
    const admissionDate = randomDate(
      new Date(currentYear - yearsAgo, 2, 1),
      new Date(currentYear - yearsAgo, 3, 30)
    );

    // Status distribution: 85% active, 10% inactive, 5% others
    const rand = Math.random();
    let status: Student["status"];
    if (rand < 0.85) status = "active";
    else if (rand < 0.95) status = "inactive";
    else if (rand < 0.97) status = "graduated";
    else if (rand < 0.99) status = "transferred";
    else status = "suspended";

    const student: Student = {
      id: `student-${i + 1}`,
      studentId: `STU${String(2024000 + i + 1).padStart(7, "0")}`,

      // Personal Information
      firstName,
      lastName,
      fatherName,
      name,
      dateOfBirth,
      gender,
      nationality: "Afghan",
      religion: Math.random() > 0.1 ? "Islam" : undefined,
      bloodGroup: Math.random() > 0.3 ? randomItem(bloodGroups) : undefined,
      photo:
        Math.random() > 0.5
          ? `https://i.pravatar.cc/150?img=${i + 1}`
          : undefined,

      // Contact Information
      address: `House ${Math.floor(Math.random() * 500) + 1}, Street ${
        Math.floor(Math.random() * 50) + 1
      }, ${city}`,
      city,
      province,
      phone: Math.random() > 0.6 ? generatePhoneNumber() : undefined,
      email:
        Math.random() > 0.7
          ? `${firstName.toLowerCase()}.${lastName.toLowerCase()}@student.sultanzoy.edu.af`
          : undefined,

      // Academic Information
      classId: classInfo.id,
      className: classInfo.name,
      section,
      rollNumber,
      admissionDate,
      academicYearId,
      status,

      // Parent/Guardian Information
      parentId: `parent-${i + 1}`,
      parentName: fatherName,
      parentRelation:
        Math.random() > 0.2
          ? "father"
          : randomItem(["mother", "guardian"] as const),
      parentContact: generatePhoneNumber(),
      parentEmail:
        Math.random() > 0.8
          ? `${fatherName.toLowerCase().replace(" ", ".")}@gmail.com`
          : undefined,
      parentOccupation:
        Math.random() > 0.5
          ? randomItem([
              "Businessman",
              "Government Employee",
              "Teacher",
              "Doctor",
              "Engineer",
              "Farmer",
              "Shopkeeper",
            ])
          : undefined,

      // Emergency Contact
      emergencyContactName:
        Math.random() > 0.4
          ? `${randomItem(maleFirstNames)} ${lastName}`
          : undefined,
      emergencyContactPhone:
        Math.random() > 0.4 ? generatePhoneNumber() : undefined,
      emergencyContactRelation:
        Math.random() > 0.4
          ? randomItem(["Uncle", "Aunt", "Grandfather", "Brother"])
          : undefined,

      // Health Information
      medicalConditions:
        Math.random() > 0.9
          ? randomItem(["Asthma", "Diabetes", "Epilepsy", "None"])
          : undefined,
      allergies:
        Math.random() > 0.95
          ? randomItem(["Peanuts", "Dust", "None"])
          : undefined,

      // Previous Education
      previousSchool:
        Math.random() > 0.6
          ? randomItem([
              "Al-Biruni School",
              "Ibn Sina Academy",
              "Ghazni Public School",
              "None",
            ])
          : undefined,
      previousClass:
        Math.random() > 0.6
          ? randomItem(["Class 8", "Class 9", "Class 10"])
          : undefined,
      transferCertificate:
        Math.random() > 0.8
          ? `/documents/transfer-cert-${i + 1}.pdf`
          : undefined,

      // System
      createdAt: randomDate(new Date(currentYear - 2, 0, 1), new Date()),
      updatedAt: randomDate(new Date(currentYear, 0, 1), new Date()),
      createdBy: "system",
    };

    students.push(student);
  }

  return students.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));
}

// Export default mock data
export const mockStudents = generateMockStudents(80);
