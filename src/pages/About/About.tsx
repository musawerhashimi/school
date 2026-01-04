import { useTranslation } from "react-i18next";
import PageHeader from "../../components/layout/PageHeader";
import CTASection from "../../components/CTASection";
import { useEffect, useState } from "react";
import CircleAnimation from "../../components/animation";
import AwardsSection from "./AwardsSection";
import LeadershipSection from "./LeadershipSection";
import MissionVisionSection from "./MissionVisionSection";
import SchoolHistorySection from "./SchoolHistorySection";

export default function About() {
  const [loading, setLoading] = useState(true);

  const { t } = useTranslation();
  useEffect(() => {
    // Simulate loading time (you can adjust this or remove it based on actual data loading)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <CircleAnimation />;
  }
  return (
    <>
      <PageHeader
        title={t("about.page.title")}
        subtitle={t("about.page.subtitle")}
        image="images/slide1.jpg"
        breadcrumb={[
          t("about.page.breadcrumb.home"),
          t("about.page.breadcrumb.about"),
        ]}
      />
      <MissionVisionSection />
      <SchoolHistorySection />
      <LeadershipSection />
      <AwardsSection />
      <CTASection />
    </>
  );
}
