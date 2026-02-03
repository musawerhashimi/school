import { useTranslation } from "react-i18next";
import { ExternalLink, Heart, Users, Handshake, Globe } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import { communityPartners, supportPrograms } from "../../data/community";

export default function CommunitySupport() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        image="images/community.jpeg"
        title={t("community.header.title")}
        subtitle={t("community.header.subtitle")}
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("community.header.title"), path: "/community-support" },
        ]}
      />

      {/* Mission Statement */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Heart className="w-5 h-5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {t("community.mission.badge")}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
              {t("community.mission.title")}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              {t("community.mission.description")}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">15+</div>
                <div className="text-sm text-text-secondary">
                  {t("community.stats.partners")}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">500+</div>
                <div className="text-sm text-text-secondary">
                  {t("community.stats.beneficiaries")}
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl transform rotate-3"></div>
            <img
              src="images/togeter.jpeg"
              alt="Community Support"
              className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* Support Programs */}
      <section className="py-16 px-4 md:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {t("community.programs.title")}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t("community.programs.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {supportPrograms.map((program, index) => (
              <div
                key={index}
                className="group bg-card rounded-2xl p-8 border border-border hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {program.icon === "users" && (
                    <Users className="w-7 h-7 text-white" />
                  )}
                  {program.icon === "heart" && (
                    <Heart className="w-7 h-7 text-white" />
                  )}
                  {program.icon === "handshake" && (
                    <Handshake className="w-7 h-7 text-white" />
                  )}
                  {program.icon === "globe" && (
                    <Globe className="w-7 h-7 text-white" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
                  {program.title[lang]}
                </h3>
                <p className="text-text-secondary leading-relaxed mb-4">
                  {program.description[lang]}
                </p>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {program.impact[lang]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Organizations */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              {t("community.partners.title")}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t("community.partners.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityPartners.map((partner, index) => (
              <div
                key={index}
                className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:shadow-2xl group"
              >
                <div className="h-48 bg-gradient-to-br from-surface to-surface-hover flex items-center justify-center p-8 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={partner.logo}
                    alt={partner.name[lang]}
                    className="max-w-full max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
                    {partner.name[lang]}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-3">
                    {partner.description[lang]}
                  </p>
                  <div className="pt-4 border-t border-border space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-muted uppercase tracking-wide">
                        {t("community.partners.collaboration")}
                      </span>
                      <p className="text-sm text-text-secondary mt-1">
                        {partner.collaboration[lang]}
                      </p>
                    </div>
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                      >
                        <span>{t("community.partners.visitWebsite")}</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            {t("community.cta.title")}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t("community.cta.description")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href="/contact"
              className="px-8 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {t("community.cta.contactUs")}
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
    </div>
  );
}
