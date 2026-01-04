import { Award, BookOpen, Trophy, Users } from "lucide-react";

import CTASection from "../../components/CTASection";
import { useTranslation } from "react-i18next"; // Add this import
import HeroSlider from "./HeroSlider";
import StatsSection from "./StatsSection";
import FeaturesSection from "./FeaturesSection";
import TestimonialsSection from "./TestimonialsSection";
import { useEffect, useState } from "react";
import AmazingLoader from "../../components/Lodear";

export default function Home() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const data = {
    slides: [
      {
        title: t("slide1Title"),
        subtitle: t("slide1Subtitle"),
        description: t("slide1Description"),
        image: "images/slide1.jpg",
      },
      {
        title: t("slide2Title"),
        subtitle: t("slide2Subtitle"),
        description: t("slide2Description"),
        image: "images/slide2.jpg",
      },
      {
        title: t("slide3Title"),
        subtitle: t("slide3Subtitle"),
        description: t("slide3Description"),
        image: "images/slide3.jpg",
      },
      {
        title: t("slide4Title"),
        subtitle: t("slide4Subtitle"),
        description: t("slide4Description"),
        image: "images/slide4.jpg",
      },
    ],
    stats: [
      {
        icon: Users,
        value: t("studentsEnrolledValue"),
        label: t("studentsEnrolledLabel"),
      },
      {
        icon: Award,
        value: t("awardsWonValue"),
        label: t("awardsWonLabel"),
      },
      {
        icon: BookOpen,
        value: t("academicProgramsValue"),
        label: t("academicProgramsLabel"),
      },
      {
        icon: Trophy,
        value: t("sportsTeamsValue"),
        label: t("sportsTeamsLabel"),
      },
    ],
  };
  useEffect(() => {
    // Simulate loading time (you can adjust this or remove it based on actual data loading)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AmazingLoader />;
  }
  return (
    <>
      <HeroSlider slides={data.slides} />
      <StatsSection stats={data.stats} />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
