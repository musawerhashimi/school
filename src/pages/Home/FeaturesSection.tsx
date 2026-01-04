import { BookOpen, Users, Award, Trophy, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import FeatureCard from "./FeatureCard";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: BookOpen,
      title: t("comprehensiveCurriculumTitle"),
      description: t("comprehensiveCurriculumDescription"),
    },
    {
      icon: Users,
      title: t("expertFacultyTitle"),
      description: t("expertFacultyDescription"),
    },
    {
      icon: Award,
      title: t("excellenceRecognitionTitle"),
      description: t("excellenceRecognitionDescription"),
    },
    {
      icon: Trophy,
      title: t("sportsActivitiesTitle"),
      description: t("sportsActivitiesDescription"),
    },
    {
      icon: Calendar,
      title: t("modernFacilitiesTitle"),
      description: t("modernFacilitiesDescription"),
    },
    {
      icon: BookOpen,
      title: t("globalPerspectiveTitle"),
      description: t("globalPerspectiveDescription"),
    },
  ];

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t("featuresHeading")}
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            {t("featuresSubheading")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
