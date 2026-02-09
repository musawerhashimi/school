import { useTranslation } from "react-i18next";
import PageHeader from "../../components/layout/PageHeader";
import CTASection from "../../components/CTASection";
import LeadershipSection from "./LeadershipSection";
import MissionVisionSection from "./MissionVisionSection";
import SchoolHistorySection from "./SchoolHistorySection";

export default function About() {
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={t("about.page.title")}
        subtitle={t("about.page.subtitle")}
        image="images/slide1.jpg"
        breadcrumb={[
          {
            name: t("about.page.breadcrumb.home"),
            path: "/",
          },
          {
            name: t("about.page.breadcrumb.about"),
            path: "/about",
          },
        ]}
      />
      <MissionVisionSection />
      <SchoolHistorySection />
      <LeadershipSection />

      <CTASection />
    </>
  );
}
