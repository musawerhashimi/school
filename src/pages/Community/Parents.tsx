import React from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/layout/PageHeader";

const ParentInvolvementPage: React.FC = () => {
  const { t } = useTranslation();

  const involvementWays = [
    {
      icon: "👥",
      titleKey: "involvement.ways.meetings.title",
      descKey: "involvement.ways.meetings.desc",
      color: "bg-info-soft hover:bg-surface-hover",
      iconBg: "bg-info",
    },
    {
      icon: "📚",
      titleKey: "involvement.ways.homeSupport.title",
      descKey: "involvement.ways.homeSupport.desc",
      color: "bg-success-soft hover:bg-surface-hover",
      iconBg: "bg-success",
    },
    {
      icon: "💬",
      titleKey: "involvement.ways.stayConnected.title",
      descKey: "involvement.ways.stayConnected.desc",
      color: "bg-surface hover:bg-surface-hover",
      iconBg: "bg-secondary",
    },
    {
      icon: "🎯",
      titleKey: "involvement.ways.volunteer.title",
      descKey: "involvement.ways.volunteer.desc",
      color: "bg-warning-soft hover:bg-surface-hover",
      iconBg: "bg-accent",
    },
    {
      icon: "📅",
      titleKey: "involvement.ways.events.title",
      descKey: "involvement.ways.events.desc",
      color: "bg-info-soft hover:bg-surface-hover",
      iconBg: "bg-primary",
    },
    {
      icon: "🤝",
      titleKey: "involvement.ways.community.title",
      descKey: "involvement.ways.community.desc",
      color: "bg-success-soft hover:bg-surface-hover",
      iconBg: "bg-success",
    },
  ];

  const benefits = [
    {
      icon: "📈",
      titleKey: "involvement.benefits.academic.title",
      descKey: "involvement.benefits.academic.desc",
    },
    {
      icon: "😊",
      titleKey: "involvement.benefits.behavior.title",
      descKey: "involvement.benefits.behavior.desc",
    },
    {
      icon: "🎓",
      titleKey: "involvement.benefits.motivation.title",
      descKey: "involvement.benefits.motivation.desc",
    },
    {
      icon: "🌟",
      titleKey: "involvement.benefits.confidence.title",
      descKey: "involvement.benefits.confidence.desc",
    },
  ];

  const guidelines = [
    {
      titleKey: "involvement.guidelines.academic.title",
      descKey: "involvement.guidelines.academic.desc",
      icon: "📖",
    },
    {
      titleKey: "involvement.guidelines.behavior.title",
      descKey: "involvement.guidelines.behavior.desc",
      icon: "⚖️",
    },
    {
      titleKey: "involvement.guidelines.communication.title",
      descKey: "involvement.guidelines.communication.desc",
      icon: "📞",
    },
    {
      titleKey: "involvement.guidelines.attendance.title",
      descKey: "involvement.guidelines.attendance.desc",
      icon: "✅",
    },
  ];

  const communicationChannels = [
    {
      icon: "📞",
      labelKey: "involvement.communication.phone.label",
      valueKey: "involvement.communication.phone.value",
      color: "text-info",
    },
    {
      icon: "📧",
      labelKey: "involvement.communication.email.label",
      valueKey: "involvement.communication.email.value",
      color: "text-primary",
    },
    {
      icon: "🕘",
      labelKey: "involvement.communication.hours.label",
      valueKey: "involvement.communication.hours.value",
      color: "text-success",
    },
    {
      icon: "🌐",
      labelKey: "involvement.communication.website.label",
      valueKey: "involvement.communication.website.value",
      color: "text-secondary",
    },
  ];

  return (
    <main className="w-full overflow-hidden">
      {/* Hero Section with PageHeader */}
      <PageHeader
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("involvement.hero.title"), path: "" },
        ]}
        image="images/parent.jpeg"
        subtitle={t("involvement.hero.subtitle")}
        title={t("involvement.hero.title")}
      />

      {/* Benefits Section */}
      <section className="py-10 px-6 bg-gradient-to-b from-background to-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              {t("involvement.benefits.title")}
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t("involvement.benefits.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-border"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="font-bold text-xl mb-3 text-text-primary">
                  {t(benefit.titleKey)}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {t(benefit.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to Get Involved */}
      <section className="py-10 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              {t("involvement.ways.title")}
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t("involvement.ways.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {involvementWays.map((way, index) => (
              <div
                key={index}
                className={`${way.color} rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-border`}
              >
                <div
                  className={`${way.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg text-white`}
                >
                  {way.icon}
                </div>
                <h3 className="font-bold text-xl mb-3 text-text-primary">
                  {t(way.titleKey)}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {t(way.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication Channels */}
      <section className="py-10 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              {t("involvement.communication.title")}
            </h2>
            <p className="text-text-secondary text-lg">
              {t("involvement.communication.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {communicationChannels.map((channel, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 flex items-center space-x-4 border border-border"
              >
                <div className="text-4xl">{channel.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-text-secondary mb-1">
                    {t(channel.labelKey)}
                  </div>
                  <div className={`${channel.color} font-medium text-lg`}>
                    {t(channel.valueKey)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Guidelines */}
      <section className="py-10 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-text-primary mb-4">
              {t("involvement.guidelines.title")}
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              {t("involvement.guidelines.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {guidelines.map((guideline, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-surface to-card p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-border"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{guideline.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-3 text-text-primary">
                      {t(guideline.titleKey)}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t(guideline.descKey)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events & Resources */}
      <section className="py-10 px-6 bg-gradient-to-b from-surface to-background">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-success-soft to-info-soft rounded-3xl p-12 shadow-xl border border-border">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-text-primary mb-4">
                {t("involvement.events.title")}
              </h2>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                {t("involvement.events.subtitle")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  iconKey: "📅",
                  titleKey: "involvement.events.meetings.title",
                  descKey: "involvement.events.meetings.desc",
                },
                {
                  iconKey: "🎓",
                  titleKey: "involvement.events.workshops.title",
                  descKey: "involvement.events.workshops.desc",
                },
                {
                  iconKey: "🎉",
                  titleKey: "involvement.events.celebrations.title",
                  descKey: "involvement.events.celebrations.desc",
                },
              ].map((event, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center border border-border"
                >
                  <div className="text-5xl mb-4">{event.iconKey}</div>
                  <h3 className="font-bold text-lg mb-2 text-text-primary">
                    {t(event.titleKey)}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {t(event.descKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptLTggMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("involvement.cta.title")}
          </h2>
          <p className="text-xl mb-10 opacity-95 leading-relaxed">
            {t("involvement.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="px-8 py-4 bg-accent hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {t("involvement.cta.primaryButton")}
            </a>
            <a
              href="/about"
              className="px-8 py-4 bg-surface hover:bg-surface-hover text-text-primary font-semibold rounded-xl border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {t("community.cta.learnMore")}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ParentInvolvementPage;
