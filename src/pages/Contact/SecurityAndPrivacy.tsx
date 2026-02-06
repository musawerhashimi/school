import React from "react";
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  Database,
  FileCheck,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface SecurityFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

// Security Feature Card
function SecurityFeatureCard({ icon, title, description }: SecurityFeature) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// Main Component
export default function SecurityPrivacyPage() {
  const { t } = useTranslation();

  const securityFeatures: SecurityFeature[] = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: t("security.features.encryption.title"),
      description: t("security.features.encryption.description"),
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: t("security.features.storage.title"),
      description: t("security.features.storage.description"),
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: t("security.features.access.title"),
      description: t("security.features.access.description"),
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: t("security.features.privacy.title"),
      description: t("security.features.privacy.description"),
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      title: t("security.features.audit.title"),
      description: t("security.features.audit.description"),
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: t("security.features.monitoring.title"),
      description: t("security.features.monitoring.description"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-background to-primary-dark text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Shield className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t("security.hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            {t("security.hero.subtitle")}
          </p>
          <p className="mt-4 text-sm text-white/80">
            {t("security.hero.lastUpdated")}
          </p>
        </div>
      </div>

      {/* Commitment Statement */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 text-success">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">
                {t("security.commitment.title")}
              </h2>
              <p className="text-text-secondary leading-relaxed mb-3">
                {t("security.commitment.p1")}
              </p>
              <p className="text-text-secondary leading-relaxed">
                {t("security.commitment.p2")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-text-primary mb-3">
            {t("security.featuresSection.title")}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {t("security.featuresSection.subtitle")}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityFeatures.map((feature, index) => (
            <SecurityFeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Important Notice */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-warning-soft border border-warning rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-warning flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {t("security.notice.title")}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {t("security.notice.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
