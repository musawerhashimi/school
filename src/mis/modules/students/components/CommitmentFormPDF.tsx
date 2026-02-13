import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { StudentApiResponse } from "../types";

// Register fonts for RTL support (Pashto/Dari)
// Note: You'll need to add these font files to public/fonts/
// Font.register({
//   family: "NotoNastaliq",
//   src: "/fonts/NotoNastaliqUrdu-Regular.ttf",
// });

interface CommitmentFormPDFProps {
  student: StudentApiResponse;
  language?: "en" | "da" | "pa";
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  pageRTL: {
    padding: 40,
    fontSize: 10,
    // fontFamily: "NotoNastaliq", // Uncomment when font is registered
    direction: "rtl",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    borderBottom: "2 solid #000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    backgroundColor: "#f0f0f0",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  rowRTL: {
    flexDirection: "row-reverse",
    marginBottom: 5,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    fontSize: 9,
  },
  value: {
    width: "60%",
    fontSize: 9,
  },
  grid: {
    flexDirection: "row",
    gap: 10,
  },
  gridRTL: {
    flexDirection: "row-reverse",
    gap: 10,
  },
  column: {
    flex: 1,
  },
  photoBox: {
    width: 100,
    height: 120,
    border: "1 solid #000",
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  commitmentBox: {
    border: "1 solid #000",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  commitmentText: {
    fontSize: 9,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureBox: {
    width: "30%",
    borderTop: "1 solid #000",
    paddingTop: 5,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: "#666",
    borderTop: "1 solid #ccc",
    paddingTop: 5,
  },
});

const CommitmentFormPDF: React.FC<CommitmentFormPDFProps> = ({
  student,
  language = "pa",
}) => {
  const isRTL = language === "pa" || language === "da";

  // Translation helpers
  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: "STUDENT COMMITMENT FORM",
        ministry: "Ministry of Education - Islamic Emirate of Afghanistan",
        schoolName: "School Name",
        personalInfo: "Personal Information",
        firstName: "First Name",
        lastName: "Last Name",
        fatherName: "Father's Name",
        grandfatherName: "Grandfather's Name",
        dateOfBirth: "Date of Birth",
        gender: "Gender",
        nationality: "Nationality",
        religion: "Religion",
        bloodGroup: "Blood Group",
        nationalId: "National ID",
        tazkiraInfo: "Tazkira Information",
        tazkiraPage: "Page Number",
        tazkiraVolume: "Volume Number",
        tazkiraReg: "Registration Number",
        birthDateOnTazkira: "Birth Date on Tazkira",
        ageOnTazkira: "Age on Tazkira",
        locationInfo: "Location Information",
        originalResidence: "Original Residence",
        currentResidence: "Current Residence",
        province: "Province",
        district: "District",
        area: "Area",
        contactInfo: "Contact Information",
        address: "Address",
        city: "City",
        phone: "Phone",
        email: "Email",
        academicInfo: "Academic Information",
        academicYear: "Academic Year",
        educationLevel: "Education Level",
        classLevel: "Class Level",
        section: "Section",
        shift: "Shift",
        admissionDate: "Admission Date",
        rollNumber: "Roll Number",
        enrollmentType: "Enrollment Type",
        guardianInfo: "Guardian Information",
        guardianName: "Guardian Name",
        relation: "Relation",
        guardianPhone: "Guardian Phone",
        guardianEmail: "Guardian Email",
        guardianOccupation: "Occupation",
        healthInfo: "Health Examination",
        hivTest: "HIV Test",
        hcvTest: "HCV Test",
        hbsTest: "HBS Test",
        testDate: "Test Date",
        previousEducation: "Previous Education",
        previousSchool: "Previous School",
        previousClass: "Previous Class",
        transferCert: "Transfer Certificate",
        commitment: "Commitment",
        commitmentText:
          "I hereby commit to abide by all school policies, regulations, and code of conduct. I understand that violation of these rules may result in disciplinary action.",
        studentSignature: "Student Signature",
        guardianSignature: "Guardian Signature",
        principalSignature: "School Principal",
        date: "Date",
      },
      pa: {
        title: "د زده کوونکي ژمنې فورم",
        ministry: "د افغانستان اسلامي امارت - د پوهنې وزارت",
        schoolName: "د ښوونځي نوم",
        personalInfo: "شخصي معلومات",
        firstName: "نوم",
        lastName: "تخلص",
        fatherName: "د پلار نوم",
        grandfatherName: "د نیکه نوم",
        dateOfBirth: "د زېږېدنې نېټه",
        gender: "جنس",
        nationality: "ملیت",
        religion: "دین",
        bloodGroup: "د وینې ګروپ",
        nationalId: "د تذکرې شمیره",
        tazkiraInfo: "د تذکرې معلومات",
        tazkiraPage: "د تذکرې پاڼه",
        tazkiraVolume: "د تذکرې ټوک",
        tazkiraReg: "د تذکرې ثبت ګڼه",
        birthDateOnTazkira: "په تذکره کې د زیږېدنې نېټه",
        ageOnTazkira: "په تذکره کې عمر",
        locationInfo: "د موقعیت معلومات",
        originalResidence: "اصلي استوګن ځای",
        currentResidence: "فعلي استوګن ځای",
        province: "ولایت",
        district: "ولسوالۍ",
        area: "سیمه",
        contactInfo: "د تماس معلومات",
        address: "پته",
        city: "ښار",
        phone: "ټیلیفون",
        email: "ایمیل",
        academicInfo: "علمي معلومات",
        academicYear: "علمي کال",
        educationLevel: "د تحصیل کچه",
        classLevel: "ټولګی",
        section: "څانګه",
        shift: "وخت",
        admissionDate: "د شمولیت نیټه",
        rollNumber: "د زده کوونکي شمیره",
        enrollmentType: "د شمولیت ډول",
        guardianInfo: "د سرپرست معلومات",
        guardianName: "د سرپرست نوم",
        relation: "تړاو",
        guardianPhone: "د سرپرست ټیلیفون",
        guardianEmail: "د سرپرست ایمیل",
        guardianOccupation: "دنده",
        healthInfo: "روغتیایی معاینه",
        hivTest: "HIV ازموینه",
        hcvTest: "HCV ازموینه",
        hbsTest: "HBS ازموینه",
        testDate: "د ازموینې نېټه",
        previousEducation: "مخکنی تحصیل",
        previousSchool: "مخکنی ښوونځی",
        previousClass: "مخکنی ټولګی",
        transferCert: "د انتقال سند",
        commitment: "ژمنه",
        commitmentText:
          "زه ژمنه کوم چې د ښوونځي ټولو مقرراتو، قوانینو او د چلند کوډ تعقیب کوم. زه پوهېږم چې د دې قوانینو څخه سرغړونه کېدای شي د انضباطي اقداماتو لامل شي.",
        studentSignature: "د زده کوونکي لاسلیک",
        guardianSignature: "د سرپرست لاسلیک",
        principalSignature: "د ښوونځي مدیر",
        date: "نېټه",
      },
      da: {
        title: "فورم تعهد شاگرد",
        ministry: "وزارت معارف - امارت اسلامی افغانستان",
        schoolName: "نام مکتب",
        personalInfo: "معلومات شخصی",
        firstName: "نام",
        lastName: "تخلص",
        fatherName: "نام پدر",
        grandfatherName: "نام نیکه",
        dateOfBirth: "تاریخ تولد",
        gender: "جنسیت",
        nationality: "ملیت",
        religion: "دین",
        bloodGroup: "گروپ خون",
        nationalId: "شماره تذکره",
        tazkiraInfo: "معلومات تذکره",
        tazkiraPage: "صفحه تذکره",
        tazkiraVolume: "جلد تذکره",
        tazkiraReg: "شماره ثبت تذکره",
        birthDateOnTazkira: "تاریخ تولد در تذکره",
        ageOnTazkira: "سن در تذکره",
        locationInfo: "معلومات موقعیت",
        originalResidence: "محل سکونت اصلی",
        currentResidence: "محل سکونت فعلی",
        province: "ولایت",
        district: "ولسوالی",
        area: "منطقه",
        contactInfo: "معلومات تماس",
        address: "آدرس",
        city: "شهر",
        phone: "تلفن",
        email: "ایمیل",
        academicInfo: "معلومات تحصیلی",
        academicYear: "سال تعلیمی",
        educationLevel: "سطح تحصیل",
        classLevel: "صنف",
        section: "شعبه",
        shift: "وقت",
        admissionDate: "تاریخ شمولیت",
        rollNumber: "شماره شاگرد",
        enrollmentType: "نوع شمولیت",
        guardianInfo: "معلومات سرپرست",
        guardianName: "نام سرپرست",
        relation: "نسبت",
        guardianPhone: "تلفن سرپرست",
        guardianEmail: "ایمیل سرپرست",
        guardianOccupation: "شغل",
        healthInfo: "معاینه صحی",
        hivTest: "تست HIV",
        hcvTest: "تست HCV",
        hbsTest: "تست HBS",
        testDate: "تاریخ آزمایش",
        previousEducation: "تحصیلات قبلی",
        previousSchool: "مکتب قبلی",
        previousClass: "صنف قبلی",
        transferCert: "سند انتقال",
        commitment: "تعهد",
        commitmentText:
          "من متعهد می‌شوم که به تمام مقررات، قوانین و کد رفتار مکتب پایبند باشم. من می‌دانم که نقض این قوانین ممکن است منجر به اقدامات انضباطی شود.",
        studentSignature: "امضای شاگرد",
        guardianSignature: "امضای سرپرست",
        principalSignature: "مدیر مکتب",
        date: "تاریخ",
      },
    };

    return translations[language]?.[key] || key;
  };

  const Row = ({ label, value }: { label: string; value?: string }) => (
    <View style={isRTL ? styles.rowRTL : styles.row}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value || "—"}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={isRTL ? styles.pageRTL : styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{t("title")}</Text>
          <Text style={styles.subtitle}>{t("ministry")}</Text>
          <Text style={styles.subtitle}>{t("schoolName")}: _____________</Text>
        </View>

        {/* Photo Box (top right for LTR, top left for RTL) */}
        <View style={{ alignSelf: isRTL ? "flex-start" : "flex-end" }}>
          <View style={styles.photoBox}>
            <Text style={{ fontSize: 8 }}>Photo</Text>
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("personalInfo")}</Text>
          <Row label={t("firstName")} value={student.first_name} />
          <Row label={t("lastName")} value={student.last_name} />
          <Row label={t("fatherName")} value={student.father_name} />
          <Row label={t("grandfatherName")} value={student.grandfather_name} />
          <Row label={t("dateOfBirth")} value={student.date_of_birth} />
          <Row label={t("gender")} value={student.gender} />
          <Row label={t("nationality")} value={student.nationality} />
          <Row label={t("religion")} value={student.religion} />
          <Row label={t("bloodGroup")} value={student.blood_group} />
          <Row label={t("nationalId")} value={student.national_id} />
        </View>

        {/* Tazkira Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("tazkiraInfo")}</Text>
          <View style={isRTL ? styles.gridRTL : styles.grid}>
            <View style={styles.column}>
              <Row
                label={t("tazkiraPage")}
                value={student.tazkira_page_number}
              />
              <Row
                label={t("tazkiraVolume")}
                value={student.tazkira_volume_number}
              />
            </View>
            <View style={styles.column}>
              <Row
                label={t("tazkiraReg")}
                value={student.tazkira_registration_number}
              />
              <Row
                label={t("ageOnTazkira")}
                value={student.age_on_tazkira?.toString()}
              />
            </View>
          </View>
        </View>

        {/* Location Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("locationInfo")}</Text>
          <Text style={{ fontSize: 9, fontWeight: "bold", marginBottom: 3 }}>
            {t("originalResidence")}:
          </Text>
          <View style={isRTL ? styles.gridRTL : styles.grid}>
            <View style={styles.column}>
              <Row label={t("province")} value={student.original_province} />
            </View>
            <View style={styles.column}>
              <Row label={t("district")} value={student.original_district} />
            </View>
            <View style={styles.column}>
              <Row label={t("area")} value={student.original_area} />
            </View>
          </View>
          <Text
            style={{
              fontSize: 9,
              fontWeight: "bold",
              marginTop: 5,
              marginBottom: 3,
            }}
          >
            {t("currentResidence")}:
          </Text>
          <View style={isRTL ? styles.gridRTL : styles.grid}>
            <View style={styles.column}>
              <Row label={t("province")} value={student.current_province} />
            </View>
            <View style={styles.column}>
              <Row label={t("district")} value={student.current_district} />
            </View>
            <View style={styles.column}>
              <Row label={t("area")} value={student.current_area} />
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("contactInfo")}</Text>
          <Row label={t("address")} value={student.address} />
          <Row label={t("city")} value={student.city} />
          <Row label={t("province")} value={student.province} />
          <Row label={t("phone")} value={student.phone} />
          <Row label={t("email")} value={student.email} />
        </View>

        {/* Academic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("academicInfo")}</Text>
          <View style={isRTL ? styles.gridRTL : styles.grid}>
            <View style={styles.column}>
              <Row
                label={t("academicYear")}
                value={student.academic_year_display}
              />
              <Row label={t("educationLevel")} value={student.education_level} />
              <Row label={t("section")} value={student.section} />
            </View>
            <View style={styles.column}>
              <Row label={t("classLevel")} value={student.current_class?.toString()} />
              <Row label={t("shift")} value={student.shift} />
              <Row label={t("rollNumber")} value={student.roll_number} />
            </View>
          </View>
          <Row label={t("admissionDate")} value={student.admission_date} />
          <Row label={t("enrollmentType")} value={student.enrollment_type} />
        </View>

        {/* Guardian Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("guardianInfo")}</Text>
          <Row
            label={t("guardianName")}
            value={`${student.primary_guardian?.first_name || ""} ${student.primary_guardian?.last_name || ""}`}
          />
          <Row
            label={t("relation")}
            value={student.primary_guardian?.relation_type}
          />
          <Row
            label={t("guardianPhone")}
            value={student.primary_guardian?.phone}
          />
          <Row
            label={t("guardianEmail")}
            value={student.primary_guardian?.email}
          />
          <Row
            label={t("guardianOccupation")}
            value={student.primary_guardian?.occupation}
          />
        </View>

        {/* Health Examination */}
        {(student.hiv_test || student.hcv_test || student.hbs_test) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("healthInfo")}</Text>
            <View style={isRTL ? styles.gridRTL : styles.grid}>
              <View style={styles.column}>
                <Row label={t("hivTest")} value={student.hiv_test} />
              </View>
              <View style={styles.column}>
                <Row label={t("hcvTest")} value={student.hcv_test} />
              </View>
              <View style={styles.column}>
                <Row label={t("hbsTest")} value={student.hbs_test} />
              </View>
            </View>
          </View>
        )}

        {/* Previous Education */}
        {(student.previous_school ||
          student.previous_class ||
          student.transfer_certificate_number) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t("previousEducation")}</Text>
            <Row label={t("previousSchool")} value={student.previous_school} />
            <Row label={t("previousClass")} value={student.previous_class} />
            <Row
              label={t("transferCert")}
              value={student.transfer_certificate_number}
            />
          </View>
        )}

        {/* Commitment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("commitment")}</Text>
          <View style={styles.commitmentBox}>
            <Text style={styles.commitmentText}>{t("commitmentText")}</Text>
          </View>
        </View>

        {/* Signature Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>{t("studentSignature")}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>{t("guardianSignature")}</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>{t("principalSignature")}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            {t("date")}: {new Date().toLocaleDateString()}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CommitmentFormPDF;
